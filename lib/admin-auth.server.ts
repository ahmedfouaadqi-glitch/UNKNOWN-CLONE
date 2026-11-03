import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { encodeBase32 } from "@/lib/totp.mjs";

export const ADMIN_SESSION_COOKIE = "webdev_app_session";
export const OAUTH_NONCE_COOKIE = "unknown_admin_oauth_nonce";
export const ADMIN_SESSION_SECONDS = 8 * 60 * 60;
export const AUTH_FLOW_SECONDS = 10 * 60;
export type AdminRole = "mfa_setup" | "mfa_pending" | "admin";
export type AdminClaims = { appId: string; openId: string; email?: string; role?: AdminRole; iat: number; exp: number; jti?: string; mfaVerifiedAt?: number };
export type AdminState =
  | { status: "signed_out" }
  | { status: "mfa_setup" | "mfa_pending"; email: string; openId: string }
  | { status: "admin"; email: string; openId: string; jti: string; expiresAt: number }
  | { status: "unavailable" };

function signingSecret() { return process.env.MANUS_JWT_SECRET || process.env.JWT_SECRET || null; }
function projectId() { return process.env.MANUS_PROJECT_ID || null; }

export function allowedAdminEmails() {
  return new Set((process.env.ADMIN_EMAIL_ALLOWLIST || "").split(",").map(v => v.trim().toLowerCase()).filter(Boolean));
}
export function isAllowedAdminEmail(email: string) { return allowedAdminEmails().has(email.trim().toLowerCase()); }

export function isAllowedAdminOrigin(value: string | null) {
  if (!value) return false;
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "https:" || parsed.origin !== value) return false;
    const allowed = new Set((process.env.ADMIN_ALLOWED_ORIGINS || "").split(",").map(v => {
      try { const u = new URL(v.trim()); return u.protocol === "https:" ? u.origin : ""; } catch { return ""; }
    }).filter(Boolean));
    for (const candidate of [process.env.SITE_URL, process.env.NEXT_PUBLIC_SITE_URL]) {
      if (candidate) { try { const u = new URL(candidate); if (u.protocol === "https:") allowed.add(u.origin); } catch {} }
    }
    allowed.add("https://unknown-ey4evzj9.manus.space");
    allowed.add("https://8328-iz0peef222bgejvbzjdyl-ce68a408.us5.manus.computer");
    return allowed.has(parsed.origin);
  } catch { return false; }
}

function safeEqualText(a: string, b: string) {
  const left = Buffer.from(a), right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}
function signPayload(payload: Record<string, unknown>) {
  const secret = signingSecret();
  if (!secret || !projectId()) throw new Error("Admin signing is not configured");
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", secret).update(`${header}.${body}`).digest("base64url");
  return `${header}.${body}.${signature}`;
}
export function verifyProjectToken(token: string | null): AdminClaims | null {
  const secret = signingSecret(), appId = projectId();
  if (!token || !secret || !appId) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    const header = JSON.parse(Buffer.from(parts[0], "base64url").toString("utf8"));
    if (header.alg !== "HS256") return null;
    const expected = createHmac("sha256", secret).update(`${parts[0]}.${parts[1]}`).digest("base64url");
    if (!safeEqualText(expected, parts[2])) return null;
    const claims = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8")) as AdminClaims;
    if (claims.appId !== appId || !claims.openId || !Number.isSafeInteger(claims.exp) || claims.exp <= Math.floor(Date.now()/1000) || !Number.isSafeInteger(claims.iat)) return null;
    return claims;
  } catch { return null; }
}
export function getCookie(request: Request, name: string) {
  const raw = request.headers.get("cookie") || "";
  for (const part of raw.split(";")) {
    const index = part.indexOf("=");
    if (index < 0) continue;
    if (part.slice(0,index).trim() === name) return decodeURIComponent(part.slice(index+1).trim());
  }
  return null;
}
export function cookieHeader(name: string, value: string, maxAge: number) {
  return `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Lax`;
}
export function appendCookie(response: Response, cookie: string) {
  response.headers.append("Set-Cookie", cookie);
  return response;
}
export function noStoreJson(body: unknown, status = 200, headers: HeadersInit = {}) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store", "Pragma": "no-cache", ...Object.fromEntries(new Headers(headers).entries()) } });
}
export function createFlowToken(identity: { openId: string; email: string }, role: "mfa_setup" | "mfa_pending") {
  const now = Math.floor(Date.now()/1000), expiresAt = now + AUTH_FLOW_SECONDS;
  return { token: signPayload({ appId: projectId(), openId: identity.openId, email: identity.email.toLowerCase(), role, iat: now, exp: expiresAt }), expiresAt };
}
export function createAdminToken(identity: { openId: string; email: string }) {
  const now = Math.floor(Date.now()/1000), jti = randomBytes(32).toString("base64url"), expiresAt = now + ADMIN_SESSION_SECONDS;
  return { token: signPayload({ appId: projectId(), openId: identity.openId, email: identity.email.toLowerCase(), role: "admin", mfaVerifiedAt: now, jti, iat: now, exp: expiresAt }), jti, expiresAt };
}
export function hashSessionId(jti: string) { return createHash("sha256").update(jti).digest("hex"); }
export function hashAdminRateSubject(openId: string) {
  const secret = signingSecret();
  if (!secret) throw new Error("Admin signing is unavailable");
  return createHmac("sha256", secret).update(`unknown-admin-mfa:${openId}`).digest("hex");
}
export function createTotpSecret() { return encodeBase32(randomBytes(20)); }
function encryptionKey() {
  const secret = signingSecret();
  if (!secret) throw new Error("Admin signing is unavailable");
  return createHmac("sha256", secret).update("unknown-admin-totp-encryption-v1").digest();
}
export function encryptTotpSecret(secret: string) {
  const iv = randomBytes(12), cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(secret,"utf8"),cipher.final()]);
  return ["v1",iv.toString("base64url"),cipher.getAuthTag().toString("base64url"),encrypted.toString("base64url")].join(".");
}
export function decryptTotpSecret(value: string) {
  const [version,ivValue,tagValue,encryptedValue] = value.split(".");
  if (version !== "v1" || !ivValue || !tagValue || !encryptedValue) throw new Error("Invalid encrypted TOTP secret");
  const decipher = createDecipheriv("aes-256-gcm",encryptionKey(),Buffer.from(ivValue,"base64url"));
  decipher.setAuthTag(Buffer.from(tagValue,"base64url"));
  return Buffer.concat([decipher.update(Buffer.from(encryptedValue,"base64url")),decipher.final()]).toString("utf8");
}
export async function readAdminState(request: Request): Promise<AdminState> {
  const claims = verifyProjectToken(getCookie(request, ADMIN_SESSION_COOKIE));
  if (!claims) return { status: "signed_out" };
  const email = typeof claims.email === "string" ? claims.email.toLowerCase() : "";
  if (claims.role === "mfa_setup" || claims.role === "mfa_pending") {
    if (!email || !isAllowedAdminEmail(email)) return { status: "signed_out" };
    return { status: claims.role, email, openId: claims.openId };
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) return { status: "unavailable" };
  if (claims.role === "admin" && email && isAllowedAdminEmail(email) && claims.jti && typeof claims.mfaVerifiedAt === "number" && claims.exp - claims.mfaVerifiedAt <= ADMIN_SESSION_SECONDS) {
    const { data, error } = await supabase.from("unknown_admin_sessions").select("id").eq("session_hash",hashSessionId(claims.jti)).is("revoked_at",null).gt("expires_at",new Date().toISOString()).maybeSingle();
    if (error) return { status: "unavailable" };
    return data ? { status:"admin",email,openId:claims.openId,jti:claims.jti,expiresAt:claims.exp } : { status:"signed_out" };
  }
  if (!claims.role) {
    const { data,error } = await supabase.from("unknown_admin_mfa_settings").select("admin_email,is_enabled").eq("open_id",claims.openId).maybeSingle();
    if (error) return { status:"unavailable" };
    const mapped = typeof data?.admin_email === "string" ? data.admin_email.toLowerCase() : "";
    if (data?.is_enabled && isAllowedAdminEmail(mapped)) return { status:"mfa_pending",email:mapped,openId:claims.openId };
  }
  return { status:"signed_out" };
}
export function readProjectClaims(request: Request) { return verifyProjectToken(getCookie(request,ADMIN_SESSION_COOKIE)); }
