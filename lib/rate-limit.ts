import "server-only";
import { createHmac } from "node:crypto";

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

/**
 * Process-local best-effort limiter. Production must also enforce limits at the
 * CDN/WAF. Raw IPs are never stored; a short-lived keyed digest is held in memory.
 */
export function checkRateLimit(request: Request, scope: string, limit: number, windowMs: number) {
  const secret = process.env.RATE_LIMIT_SECRET;
  if (!secret) return { allowed: false, reason: "rate_limit_not_configured" as const };
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = request.headers.get("x-real-ip")?.trim();
  const ip = forwarded || realIp || "unknown";
  const key = createHmac("sha256", secret).update(scope + ":" + ip).digest("hex").slice(0, 24);
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
