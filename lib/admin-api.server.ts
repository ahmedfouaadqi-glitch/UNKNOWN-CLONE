import { randomBytes } from "node:crypto";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { verifyTotp } from "@/lib/totp.mjs";
import {
  ADMIN_SESSION_COOKIE, OAUTH_NONCE_COOKIE, AUTH_FLOW_SECONDS, ADMIN_SESSION_SECONDS,
  appendCookie, cookieHeader, createFlowToken, createAdminToken, createTotpSecret,
  decryptTotpSecret, encryptTotpSecret, getCookie, hashAdminRateSubject, hashSessionId,
  isAllowedAdminEmail, isAllowedAdminOrigin, noStoreJson, readAdminState, readProjectClaims
} from "@/lib/admin-auth.server";

const UUID = /^[0-9a-f-]{36}$/i;
const jsonError = (message: string, status: number) => noStoreJson({ error: message }, status);
const clearCookies = (response: Response) => {
  appendCookie(response, cookieHeader(ADMIN_SESSION_COOKIE, "", 0));
  appendCookie(response, cookieHeader(OAUTH_NONCE_COOKIE, "", 0));
  return response;
};

export async function adminSession(request: Request) {
  const state = await readAdminState(request);
  if (state.status === "unavailable") return noStoreJson({ status: "unavailable" }, 503);
  if (state.status === "admin" || state.status === "mfa_setup" || state.status === "mfa_pending") return noStoreJson({ status: state.status, email: state.email });
  return noStoreJson({ status: "signed_out" });
}

export async function adminAuthStart(request: Request) {
  const origin = request.headers.get("origin");
  if (!isAllowedAdminOrigin(origin)) return jsonError("Origin is not permitted.",403);
  const portal = process.env.MANUS_OAUTH_PORTAL_URL, appId = process.env.MANUS_PROJECT_ID;
  if (!portal || !appId) return jsonError("Manus login is not configured.",503);
  let portalUrl: URL;
  try { portalUrl = new URL(portal); if (portalUrl.protocol !== "https:") throw new Error(); }
  catch { return jsonError("Manus login configuration is invalid.",503); }
  const nonce = randomBytes(32).toString("base64url");
  const redirectUri = `${origin}/api/admin/auth/callback`;
  const state = Buffer.from(JSON.stringify({ redirectUri, nonce })).toString("base64url");
  const authorizationUrl = new URL("/app-auth",portalUrl);
  authorizationUrl.searchParams.set("appId",appId);
  authorizationUrl.searchParams.set("redirectUri",redirectUri);
  authorizationUrl.searchParams.set("state",state);
  authorizationUrl.searchParams.set("responseType","code");
  return appendCookie(noStoreJson({ authorizationUrl: authorizationUrl.toString() }),cookieHeader(OAUTH_NONCE_COOKIE,nonce,600));
}

export async function adminAuthCallback(request: Request) {
  const url = new URL(request.url), rawState = url.searchParams.get("state"), code = url.searchParams.get("code");
  const cookieNonce = getCookie(request,OAUTH_NONCE_COOKIE);
  if (!rawState || !cookieNonce || !code) return new Response("Invalid OAuth state.",{status:400,headers:{"Cache-Control":"no-store"}});
  let state: {redirectUri?:string;nonce?:string};
  try { state = JSON.parse(Buffer.from(rawState,"base64url").toString("utf8")); }
  catch { return new Response("Invalid OAuth state.",{status:400,headers:{"Cache-Control":"no-store"}}); }
  if (!state.redirectUri || !state.nonce || state.nonce !== cookieNonce) return new Response("OAuth state verification failed.",{status:400,headers:{"Cache-Control":"no-store"}});
  let callback: URL;
  try { callback = new URL(state.redirectUri); } catch { return new Response("Invalid callback origin.",{status:400}); }
  if (!isAllowedAdminOrigin(callback.origin) || state.redirectUri !== `${callback.origin}/api/admin/auth/callback`) return new Response("Callback origin is not permitted.",{status:400});
  const redirect = (codeValue: string) => Response.redirect(new URL(`/admin?auth=${encodeURIComponent(codeValue)}`,callback.origin),302);
  const configuredApiBase = process.env.MANUS_OAUTH_API_URL, appId = process.env.MANUS_PROJECT_ID;
  if (!configuredApiBase || !appId) return redirect("login-unavailable");
  let apiBase: string;
  try {
    const parsedApiBase = new URL(configuredApiBase);
    if (parsedApiBase.protocol !== "https:") return redirect("login-unavailable");
    apiBase = parsedApiBase.origin;
  } catch { return redirect("login-unavailable"); }
  try {
    const exchange = await fetch(`${apiBase.replace(/\/$/,"")}/webdev.v1.WebDevAuthPublicService/ExchangeToken`,{
      method:"POST",headers:{"Content-Type":"application/json"},cache:"no-store",signal:AbortSignal.timeout(15000),
      body:JSON.stringify({clientId:appId,grantType:"authorization_code",code,redirectUri:state.redirectUri})
    });
    if (!exchange.ok) return redirect("login-failed");
    const token = await exchange.json() as {accessToken?:string};
    if (!token.accessToken) return redirect("login-failed");
    const identityResponse = await fetch(`${apiBase.replace(/\/$/,"")}/webdev.v1.WebDevAuthPublicService/GetUserInfo`,{
      method:"POST",headers:{"Content-Type":"application/json"},cache:"no-store",signal:AbortSignal.timeout(15000),
      body:JSON.stringify({accessToken:token.accessToken})
    });
    if (!identityResponse.ok) return redirect("login-failed");
    const user = await identityResponse.json() as {openId?:string;email?:string};
    const email = typeof user.email === "string" ? user.email.trim().toLowerCase() : "";
    const openId = typeof user.openId === "string" ? user.openId.trim() : "";
    if (!email || !openId || !isAllowedAdminEmail(email)) return redirect("access-denied");
    const supabase = getSupabaseAdmin();
    if (!supabase) return redirect("database-unavailable");
    const {data:existing,error} = await supabase.from("unknown_admin_mfa_settings").select("admin_email,open_id,is_enabled").eq("admin_email",email).maybeSingle();
    if (error) return redirect("database-unavailable");
    if (existing && existing.open_id !== openId) return redirect("identity-mismatch");
    const flow = createFlowToken({email,openId},existing?.is_enabled ? "mfa_pending" : "mfa_setup");
    const response = Response.redirect(new URL("/admin",callback.origin),302);
    response.headers.set("Cache-Control","no-store");
    appendCookie(response,cookieHeader(ADMIN_SESSION_COOKIE,flow.token,AUTH_FLOW_SECONDS));
    appendCookie(response,cookieHeader(OAUTH_NONCE_COOKIE,"",0));
    return response;
  } catch { return redirect("login-failed"); }
}

export async function adminLogout(request: Request) {
  if (!isAllowedAdminOrigin(request.headers.get("origin"))) return jsonError("Origin is not permitted.",403);
  const state = await readAdminState(request);
  if (state.status === "admin") {
    const supabase = getSupabaseAdmin();
    if (!supabase) return jsonError("Admin storage is unavailable.",503);
    const {error} = await supabase.from("unknown_admin_sessions").update({revoked_at:new Date().toISOString()}).eq("session_hash",hashSessionId(state.jti)).is("revoked_at",null);
    if (error) return jsonError("Unable to revoke administrator session.",503);
  }
  return clearCookies(noStoreJson({ok:true}));
}

export async function adminMfaSetup(request: Request) {
  if (!isAllowedAdminOrigin(request.headers.get("origin"))) return jsonError("Origin is not permitted.",403);
  const claims = readProjectClaims(request);
  if (!claims || claims.role !== "mfa_setup" || !claims.email || !isAllowedAdminEmail(claims.email) || !claims.openId) return jsonError("Administrator sign-in is required.",401);
  const supabase = getSupabaseAdmin();
  if (!supabase) return jsonError("Secure admin storage is unavailable.",503);
  const email = claims.email.toLowerCase();
  const {data:existing,error} = await supabase.from("unknown_admin_mfa_settings").select("admin_email,open_id,secret_ciphertext,is_enabled").eq("admin_email",email).maybeSingle();
  if (error) return jsonError("Admin storage is not ready.",503);
  if (existing?.open_id && existing.open_id !== claims.openId) return jsonError("Administrator identity does not match.",403);
  if (existing?.is_enabled) return jsonError("Multi-factor authentication is already enrolled.",409);
  let secret: string;
  if (existing?.secret_ciphertext) {
    try { secret = decryptTotpSecret(existing.secret_ciphertext); } catch { return jsonError("The TOTP enrollment record could not be opened.",503); }
  } else {
    secret = createTotpSecret();
    const {error:insertError} = await supabase.from("unknown_admin_mfa_settings").insert({admin_email:email,open_id:claims.openId,secret_ciphertext:encryptTotpSecret(secret),is_enabled:false,last_verified_counter:-1});
    if (insertError) return jsonError("Unable to create the TOTP enrollment record.",503);
  }
  const issuer = "UNKNOWN", label = encodeURIComponent(`${issuer}:${email}`);
  return noStoreJson({secret,otpauthUri:`otpauth://totp/${label}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`,issuer,email});
}

export async function adminMfaVerify(request: Request) {
  if (!isAllowedAdminOrigin(request.headers.get("origin"))) return jsonError("Origin is not permitted.",403);
  const claims = readProjectClaims(request);
  if (!claims?.openId) return jsonError("Administrator sign-in is required.",401);
  let input: any;
  try { input = await request.json(); } catch { return jsonError("Invalid JSON body.",400); }
  if (!input || typeof input.code !== "string" || !/^\d{6}$/.test(input.code)) return jsonError("Enter the six-digit authenticator code.",400);
  const supabase = getSupabaseAdmin();
  if (!supabase) return jsonError("Secure admin storage is unavailable.",503);
  const subjectHash = hashAdminRateSubject(claims.openId);
  const {data:limitRows,error:limitError} = await supabase.rpc("unknown_admin_check_mfa_limit",{p_subject_hash:subjectHash});
  if (limitError) return jsonError("MFA rate limiting is unavailable.",503);
  const limit = Array.isArray(limitRows) ? limitRows[0] : limitRows;
  if (!limit || limit.allowed !== true) return jsonError("Too many verification attempts. Try again later.",429);
  let query = supabase.from("unknown_admin_mfa_settings").select("admin_email,open_id,secret_ciphertext,is_enabled,last_verified_counter");
  query = claims.email ? query.eq("admin_email",claims.email.toLowerCase()) : query.eq("open_id",claims.openId);
  const {data:setting,error} = await query.maybeSingle();
  if (error) return jsonError("Admin storage is not ready.",503);
  if (!setting || setting.open_id !== claims.openId || !setting.secret_ciphertext) return jsonError("TOTP enrollment is not ready.",409);
  const email = setting.admin_email.toLowerCase();
  if (!isAllowedAdminEmail(email)) return jsonError("Administrator access is not permitted.",403);
  if (claims.role !== "mfa_setup" && claims.role !== "mfa_pending" && claims.role !== undefined) return jsonError("A fresh administrator sign-in is required.",401);
  if (claims.role === "mfa_pending" && !setting.is_enabled) return jsonError("TOTP enrollment is not complete.",409);
  let secret: string;
  try { secret = decryptTotpSecret(setting.secret_ciphertext); } catch { return jsonError("The TOTP enrollment record could not be opened.",503); }
  const counter = verifyTotp(secret,input.code,Date.now(),Number(setting.last_verified_counter ?? -1));
  if (counter === null) return jsonError("The authenticator code is invalid or has already been used.",401);
  const {error:resetError} = await supabase.rpc("unknown_admin_reset_mfa_limit",{p_subject_hash:subjectHash});
  if (resetError) return jsonError("MFA rate limiting is unavailable.",503);
  const now = new Date().toISOString();
  const {data:updated,error:updateError} = await supabase.from("unknown_admin_mfa_settings").update({is_enabled:true,last_verified_counter:counter,updated_at:now}).eq("admin_email",email).eq("open_id",claims.openId).lt("last_verified_counter",counter).select("admin_email").maybeSingle();
  if (updateError || !updated) return jsonError("The code was already used or enrollment changed. Sign in again.",409);
  const session = createAdminToken({email,openId:claims.openId});
  const {error:sessionError} = await supabase.from("unknown_admin_sessions").insert({admin_email:email,session_hash:hashSessionId(session.jti),expires_at:new Date(session.expiresAt*1000).toISOString()});
  if (sessionError) return jsonError("Unable to create the administrator session.",503);
  const {error:auditError} = await supabase.from("unknown_admin_audit_events").insert({actor_email:email,action:setting.is_enabled ? "totp_login" : "totp_enrolled",target_type:"admin",target_id:email,reason:setting.is_enabled ? "MFA verified" : "Initial TOTP enrollment completed"});
  if (auditError) {
    await supabase.from("unknown_admin_sessions").update({revoked_at:now}).eq("session_hash",hashSessionId(session.jti));
    return jsonError("Unable to record the administrator audit event.",503);
  }
  return appendCookie(noStoreJson({ok:true}),cookieHeader(ADMIN_SESSION_COOKIE,session.token,ADMIN_SESSION_SECONDS));
}

export async function adminQueue(request: Request) {
  const state = await readAdminState(request);
  if (request.method === "GET") {
    if (state.status === "unavailable") return jsonError("Admin storage is unavailable.",503);
    if (state.status !== "admin") return jsonError("Administrator sign-in is required.",401);
    const supabase = getSupabaseAdmin();
    if (!supabase) return jsonError("Admin storage is unavailable.",503);
    const [reportsResult,postsResult,commentsResult] = await Promise.all([
      supabase.from("unknown_reports").select("id,reference,target_type,target_id,reason,details,status,created_at").in("status",["open","in_review"]).order("created_at",{ascending:false}).limit(100),
      supabase.from("unknown_posts").select("id,title,body,category,language,created_at").eq("status","pending_review").order("created_at",{ascending:false}).limit(100),
      supabase.from("unknown_comments").select("id,post_id,body,language,created_at").eq("status","pending_review").order("created_at",{ascending:false}).limit(100)
    ]);
    if (reportsResult.error || postsResult.error || commentsResult.error) return jsonError("Unable to load the moderation queue.",503);
    const reportRows = reportsResult.data || [];
    const postIds = [...new Set(reportRows.filter(x=>x.target_type==="post").map(x=>x.target_id))];
    const commentIds = [...new Set(reportRows.filter(x=>x.target_type==="comment").map(x=>x.target_id))];
    const [reportedPosts,reportedComments] = await Promise.all([
      postIds.length ? supabase.from("unknown_posts").select("id,title,body,category,language,status").in("id",postIds) : Promise.resolve({data:[],error:null}),
      commentIds.length ? supabase.from("unknown_comments").select("id,post_id,body,language,status").in("id",commentIds) : Promise.resolve({data:[],error:null})
    ]);
    if (reportedPosts.error || reportedComments.error) return jsonError("Unable to load reported content.",503);
    const content = new Map<string,unknown>();
    for (const row of reportedPosts.data || []) content.set(`post:${row.id}`,row);
    for (const row of reportedComments.data || []) content.set(`comment:${row.id}`,row);
    return noStoreJson({reports:reportRows.map(row=>({...row,content:content.get(`${row.target_type}:${row.target_id}`) || null})),pendingPosts:postsResult.data || [],pendingComments:commentsResult.data || []});
  }
  if (!isAllowedAdminOrigin(request.headers.get("origin"))) return jsonError("Origin is not permitted.",403);
  if (state.status === "unavailable") return jsonError("Admin storage is unavailable.",503);
  if (state.status !== "admin") return jsonError("Administrator sign-in is required.",401);
  let input: any;
  try { input = await request.json(); } catch { return jsonError("Invalid JSON body.",400); }
  if (!input || typeof input.action !== "string") return jsonError("Invalid moderation action.",400);
  const reason = typeof input.reason === "string" ? input.reason.replace(/<[^>]*>/g,"").trim().slice(0,500) : "";
  if (reason.length < 8) return jsonError("Enter a decision reason of at least 8 characters.",400);
  const supabase = getSupabaseAdmin();
  if (!supabase) return jsonError("Admin storage is unavailable.",503);
  let args: Record<string,unknown>;
  if (input.action === "dismiss_report" || input.action === "remove_reported_content") {
    if (typeof input.reportId !== "string" || !UUID.test(input.reportId)) return jsonError("Invalid report reference.",400);
    args = {p_actor_email:state.email,p_action:input.action,p_target_type:null,p_target_id:null,p_report_id:input.reportId,p_reason:reason};
  } else if (input.action === "reject_content") {
    if ((input.targetType !== "post" && input.targetType !== "comment") || typeof input.targetId !== "string" || !UUID.test(input.targetId)) return jsonError("Invalid content reference.",400);
    args = {p_actor_email:state.email,p_action:input.action,p_target_type:input.targetType,p_target_id:input.targetId,p_report_id:null,p_reason:reason};
  } else return jsonError("This moderation action is not available.",400);
  const {error} = await supabase.rpc("unknown_admin_decide",args);
  if (error) return jsonError("The moderation decision could not be completed.",409);
  return noStoreJson({ok:true});
}
