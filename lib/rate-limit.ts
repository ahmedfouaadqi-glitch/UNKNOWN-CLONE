import "server-only";
import { createHmac } from "node:crypto";
import { getTrustedRateLimitAddress } from "@/lib/rate-limit-key.mjs";

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

/**
 * Process-local best-effort limiter. Production still needs a distributed
 * limiter and edge/WAF controls. Only a validated platform client-IP header
 * is trusted; caller-controlled X-Forwarded-For and X-Real-IP are ignored.
 * Raw addresses are never stored.
 */
export function checkRateLimit(request: Request, scope: string, limit: number, windowMs: number) {
  const secret = process.env.RATE_LIMIT_SECRET;
  if (!secret) return { allowed: false, reason: "rate_limit_not_configured" as const };
  const address = getTrustedRateLimitAddress(request.headers);
  const key = createHmac("sha256", secret).update(scope + ":" + address).digest("hex").slice(0, 24);
  const now = Date.now();
  for (const [bucketKey, value] of buckets) if (value.resetAt <= now) buckets.delete(bucketKey);
  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true as const };
  }
  if (current.count >= limit) return { allowed: false as const, reason: "rate_limited" as const };
  current.count += 1;
  return { allowed: true as const };
}
