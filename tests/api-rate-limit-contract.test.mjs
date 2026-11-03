import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const handlers = [
  "app/api/posts/route.ts",
  "app/api/posts/[id]/comments/route.ts",
  "app/api/posts/[id]/reactions/route.ts",
  "app/api/reports/route.ts",
  "app/api/delete/route.ts"
];

test("all public write handlers await the shared rate limiter", async () => {
  for (const path of handlers) {
    const source = await readFile(new URL(path, root), "utf8");
    assert.match(source, /await checkRateLimit\(/, path + " must await checkRateLimit");
    assert.match(source, /rate\.reason === "rate_limited"/, path + " must distinguish a rate-limit decision from service failure");
    assert.match(source, /\? 429 : 503/, path + " must fail closed when the limiter is unavailable");
  }
});

test("shared limiter uses an atomic Supabase RPC and never stores raw addresses", async () => {
  const source = await readFile(new URL("lib/rate-limit.ts", root), "utf8");
  assert.match(source, /unknown_consume_public_rate_limit/);
  assert.match(source, /createHmac\("sha256"/);
  assert.match(source, /if \(!address\) return \{ allowed: false, reason: "rate_limit_unavailable" \}/);
  assert.doesNotMatch(source, /x-forwarded-for/);
});

test("rate limit migration restricts table and function to service role", async () => {
  const source = await readFile(new URL("supabase/migrations/20261103020000_public_rate_limits.sql", root), "utf8");
  assert.match(source, /enable row level security/i);
  assert.match(source, /revoke all on table public\.public_rate_limits from public, anon, authenticated/i);
  assert.match(source, /grant all on table public\.public_rate_limits to service_role/i);
  assert.match(source, /for update/i);
  assert.match(source, /revoke all on function public\.unknown_consume_public_rate_limit/i);
  assert.match(source, /grant execute on function public\.unknown_consume_public_rate_limit[\s\S]*to service_role/i);
});
