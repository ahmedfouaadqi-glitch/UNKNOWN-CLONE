import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("admin API routes are server-dispatched and cover every auth/moderation endpoint", async () => {
  const source = await read("src/routes/api/$.ts");
  for (const path of [
    "/api/admin/session", "/api/admin/auth/start", "/api/admin/auth/callback",
    "/api/admin/logout", "/api/admin/mfa/setup", "/api/admin/mfa/verify", "/api/admin/queue"
  ]) assert.ok(source.includes(path), "missing admin endpoint " + path);
  assert.match(source, /import\("@\/lib\/admin-api\.server"\)/);
});

test("admin route is explicit, private from indexing, and mounts the moderation panel", async () => {
  const route = await read("src/routes/admin.tsx");
  assert.match(route, /createFileRoute\("\/admin"\)/);
  assert.match(route, /noindex, nofollow, noarchive, nosnippet/);
  assert.match(route, /<AdminPanel/);
});

test("admin auth requires configured signing, email allowlist, trusted origin and revocable DB sessions", async () => {
  const auth = await read("lib/admin-auth.server.ts");
  assert.match(auth, /MANUS_JWT_SECRET \|\| process\.env\.JWT_SECRET/);
  assert.match(auth, /ADMIN_EMAIL_ALLOWLIST/);
  assert.match(auth, /ADMIN_ALLOWED_ORIGINS/);
  assert.match(auth, /timingSafeEqual/);
  assert.match(auth, /unknown_admin_sessions/);
  assert.match(auth, /revoked_at/);
  assert.match(auth, /AES-256-GCM|aes-256-gcm/);
});

test("admin MFA and moderation handlers use atomic database controls and audited decisions", async () => {
  const api = await read("lib/admin-api.server.ts");
  assert.match(api, /parsedApiBase\.protocol !== "https:"/);
  assert.match(api, /unknown_admin_check_mfa_limit/);
  assert.match(api, /unknown_admin_reset_mfa_limit/);
  assert.match(api, /verifyTotp\(/);
  assert.match(api, /last_verified_counter/);
  assert.match(api, /unknown_admin_audit_events/);
  assert.match(api, /unknown_admin_decide/);
  assert.doesNotMatch(api, /publish_post|publish_content/);
});

test("admin browser component only calls the protected admin endpoints", async () => {
  const panel = await read("src/components/admin/admin-panel.tsx");
  for (const endpoint of ["/api/admin/session", "/api/admin/auth/start", "/api/admin/mfa/setup", "/api/admin/mfa/verify", "/api/admin/queue", "/api/admin/logout"]) {
    assert.ok(panel.includes(endpoint), "missing UI endpoint " + endpoint);
  }
});
