import { randomUUID } from "node:crypto";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { canPublish } from "@/lib/publishing";
import { checkRateLimit } from "@/lib/rate-limit";
import { createDeletionToken, hashDeletionToken } from "@/lib/crypto";
import { cleanText, json, parseJson } from "@/lib/http";
import { legalVersions } from "@/lib/legal";
import { moderateText } from "@/lib/moderation.mjs";
import { categories } from "@/lib/categories";
import { parseSearchTerm } from "@/lib/search.mjs";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return json({ error: "Publishing database is not configured.", code: "database_not_configured" }, 503);
  const url = new URL(request.url);
  const requestedLimit = Number(url.searchParams.get("limit") || 12);
  const requestedPage = Number(url.searchParams.get("page") || 1);
  const limit = Number.isFinite(requestedLimit) ? Math.min(Math.max(Math.floor(requestedLimit), 1), 40) : 12;
  const page = Number.isFinite(requestedPage) ? Math.min(Math.max(Math.floor(requestedPage), 1), 1000) : 1;
  const category = url.searchParams.get("category");
  if (category && !categories.some(item => item.id === category)) {
    return json({ posts: [], total: 0, page, pageSize: limit, totalPages: 0 });
  }
  const parsedSearch = parseSearchTerm(url.searchParams.get("q"));
  const search = parsedSearch.term;
  if (!parsedSearch.valid) {
    return json({ error: "Search must contain 2–80 letters or numbers.", code: "invalid_search" }, 400);
  }
  let query = supabase.from("posts").select("id,title,body,category,language,published_at", { count: "exact" })
    .eq("status", "published");
  if (category) query = query.eq("category", category);
  if (search) {
    const pattern = `%${search}%`;
    query = query.or(`title.ilike.${pattern},body.ilike.${pattern}`);
  }
  const from = (page - 1) * limit;
  const { data, error, count } = await query.order("published_at", { ascending: false }).range(from, from + limit - 1);
  if (error) return json({ error: "Unable to load stories." }, 503);
  const total = count || 0;
  return json({ posts: data || [], total, page, pageSize: limit, totalPages: Math.ceil(total / limit), hasMore: total > page * limit });
}

export async function POST(request: Request) {
  const gate = canPublish(request.headers);
  if (!gate.allowed) return json({ error: "Publishing is not enabled for this market.", code: "market_disabled" }, 403);
  const rate = await checkRateLimit(request, "posts", 3, 60_000);
  if (!rate.allowed) return json({ error: rate.reason === "rate_limited" ? "Too many submissions. Please try again later." : "Rate limiting is temporarily unavailable.", code: rate.reason }, rate.reason === "rate_limited" ? 429 : 503);
  const body = parseJson(await request.json().catch(() => null));
  if (!body) return json({ error: "Invalid request." }, 400);
  const title = typeof body.title === "string" ? body.title.normalize("NFKC").trim().slice(0, 100) : "";
  const text = cleanText(body.body, 5000);
  const category = cleanText(body.category, 40);
  const language = body.language === "ar" || body.language === "en" ? body.language : null;
  if (!text || text.length < 8 || !category || !categories.some(item => item.id === category) || !language) {
    return json({ error: "Please complete the required fields." }, 400);
  }
  if (body.acceptedTerms !== true || body.acceptedPrivacy !== true || body.acceptedDisclaimer !== true || body.confirmedAdult !== true) {
    return json({ error: "Required agreements were not accepted.", code: "consent_required" }, 400);
  }
  const moderation = moderateText([title, text].filter(Boolean).join("\n"));
  if (moderation.status === "reject") return json({ error: "This text cannot be published under the safety rules.", code: "moderation_rejected" }, 422);
  const supabase = getSupabaseAdmin();
  if (!supabase) return json({ error: "Publishing database is not configured.", code: "database_not_configured" }, 503);

  const id = randomUUID();
  const deletionToken = createDeletionToken();
  const status = moderation.status === "review" ? "pending_review" : "published";
  const now = new Date().toISOString();
  const { error } = await supabase.from("posts").insert({
    id, title: title || null, body: text, category, language, status,
    published_at: status === "published" ? now : null,
    deletion_token_hash: hashDeletionToken(deletionToken),
    terms_version: legalVersions.terms, privacy_version: legalVersions.privacy,
    disclaimer_version: legalVersions.disclaimer, content_policy_version: legalVersions.community
  });
  if (error) return json({ error: "Unable to save the submission." }, 503);
  await supabase.from("legal_acceptances").insert({
    post_id: id, terms_version: legalVersions.terms, privacy_version: legalVersions.privacy,
    disclaimer_version: legalVersions.disclaimer, age_declaration: true, locale: language
  });
  await supabase.from("moderation_events").insert({
    target_type: "post", target_id: id, rule_code: moderation.code,
    outcome: status, engine: "local-rules-v1"
  });
  return json({ id, status, deletionToken, message: status === "published" ? "Published" : "Pending review" }, 201);
}
