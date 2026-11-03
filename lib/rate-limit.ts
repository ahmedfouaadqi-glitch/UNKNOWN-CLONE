import "server-only";
import { createHmac } from "node:crypto";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getTrustedRateLimitAddress } from "@/lib/rate-limit-key.mjs";

type RateLimitRow = { allowed?: unknown; retry_after?: string | null };
export type RateLimitResult =
  | { allowed: true }
  | { allowed: false; reason: "rate_limited"; retryAfterSeconds?: number }
  | { allowed: false; reason: "rate_limit_unavailable" };

/**
 * Shared, atomic rate limiting backed by Supabase RPC.
 * Only a validated platform client-IP header is trusted; caller-controlled
 * forwarding headers are ignored. Raw addresses are never persisted.
 */
export async function checkRateLimit(
  request: Request,
  scope: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  const secret = process.env.RATE_LIMIT_SECRET;
  if (!secret || !Number.isInteger(limit) || limit < 1 ||
      !Number.isFinite(windowMs) || windowMs < 1000) {
    return { allowed: false, reason: "rate_limit_unavailable" };
  }

  const address = getTrustedRateLimitAddress(request.headers);
  if (!address) return { allowed: false, reason: "rate_limit_unavailable" };

  const subjectHash = createHmac("sha256", secret)
    .update(`unknown-rate-v1:${scope}:${address}`)
    .digest("hex");
  const windowSeconds = Math.max(1, Math.ceil(windowMs / 1000));

  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) return { allowed: false, reason: "rate_limit_unavailable" };
    const { data, error } = await supabase.rpc("unknown_consume_public_rate_limit", {
      p_subject_hash: subjectHash,
      p_limit: limit,
      p_window_seconds: windowSeconds
    });
    if (error) return { allowed: false, reason: "rate_limit_unavailable" };

    const row = (Array.isArray(data) ? data[0] : data) as RateLimitRow | null;
    if (!row || typeof row.allowed !== "boolean") {
      return { allowed: false, reason: "rate_limit_unavailable" };
    }
    if (row.allowed) return { allowed: true };

    const retryAt = row.retry_after ? Date.parse(row.retry_after) : Number.NaN;
    return {
      allowed: false,
      reason: "rate_limited",
      ...(Number.isFinite(retryAt)
        ? { retryAfterSeconds: Math.max(1, Math.ceil((retryAt - Date.now()) / 1000)) }
        : {})
    };
  } catch {
    return { allowed: false, reason: "rate_limit_unavailable" };
  }
}
