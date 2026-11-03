import { randomUUID } from "node:crypto";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { canPublish } from "@/lib/publishing";
import { checkRateLimit } from "@/lib/rate-limit";
import { createDeletionToken, hashDeletionToken } from "@/lib/crypto";
import { cleanText, json, parseJson } from "@/lib/http";
import { legalVersions } from "@/lib/legal";
import { moderateText } from "@/lib/moderation.mjs";

export const runtime = "nodejs";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return json({ comments: [] });
  const supabase = getSupabaseAdmin();
  if (!supabase) return json({ comments: [] });
  const { data, error } = await supabase.from("comments")
    .select("id,body,created_at").eq("post_id", id).eq("status", "published")
    .order("created_at", { ascending: true }).limit(100);
  if (error) return json({ comments: [] });
  return json({ comments: data || [] });
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id: postId } = await context.params;
  if (!/^[0-9a-f-]{36}$/i.test(postId)) return json({ error: "Invalid story." }, 400);
  const gate = canPublish(request.headers);
  if (!gate.allowed) return json({ error: "Publishing is not enabled for this market.", code: "market_disabled" }, 403);
  const rate = await checkRateLimit(request, "comments", 8, 60_000);
  if (!rate.allowed) return json({ error: rate.reason === "rate_limited" ? "Too many comments. Please try again later." : "Comment rate limiting is temporarily unavailable." }, rate.reason === "rate_limited" ? 429 : 503);
  const input = parseJson(await request.json().catch(() => null));
  if (!input) return json({ error: "Invalid request." }, 400);
  const text = cleanText(input.body, 1500);
  const language = input.language === "ar" || input.language === "en" ? input.language : null;
  if (!text || text.length < 2 || !language || input.accepted !== true || input.adult !== true) return json({ error: "Required fields and agreements are missing." }, 400);
  const moderation = moderateText(text);
  if (moderation.status === "reject") return json({ error: "This response is not allowed." }, 422);
  const supabase = getSupabaseAdmin();
  if (!supabase) return json({ error: "Publishing database is not configured." }, 503);
  const { data: post } = await supabase.from("posts").select("id").eq("id", postId).eq("status", "published").maybeSingle();
  if (!post) return json({ error: "Story not found." }, 404);
  const id = randomUUID();
  const deletionToken = createDeletionToken();
  const status = moderation.status === "review" ? "pending_review" : "published";
  const { error } = await supabase.from("comments").insert({
    id, post_id: postId, body: text, language, status,
    deletion_token_hash: hashDeletionToken(deletionToken)
  });
  if (error) return json({ error: "Unable to save the response." }, 503);
  await supabase.from("moderation_events").insert({ target_type: "comment", target_id: id, rule_code: moderation.code, outcome: status, engine: "local-rules-v1" });
  await supabase.from("legal_acceptances").insert({
    comment_id: id, terms_version: legalVersions.terms, privacy_version: legalVersions.privacy,
    disclaimer_version: legalVersions.disclaimer, age_declaration: true, locale: language
  });
  return json({ id, status, deletionToken }, 201);
}
