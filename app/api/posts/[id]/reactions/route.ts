import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { canPublish } from "@/lib/publishing";
import { checkRateLimit } from "@/lib/rate-limit";
import { scopedVisitorHash } from "@/lib/crypto";
import { json, parseJson } from "@/lib/http";

export const runtime = "nodejs";
const allowed = new Set(["care", "not-alone", "wish-well"]);

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const supabase = getSupabaseAdmin();
  if (!supabase || !/^[0-9a-f-]{36}$/i.test(id)) return json({ counts: {} });
  const { data } = await supabase.from("reactions").select("reaction_type").eq("post_id", id);
  const counts: Record<string, number> = {};
  for (const row of data || []) counts[row.reaction_type] = (counts[row.reaction_type] || 0) + 1;
  return json({ counts });
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return json({ error: "Invalid story." }, 400);
  if (!canPublish(request.headers).allowed) return json({ error: "Reactions are not enabled for this market." }, 403);
  const rate = await checkRateLimit(request, "reactions", 12, 60_000);
  if (!rate.allowed) return json({ error: rate.reason === "rate_limited" ? "Please slow down." : "Reaction rate limiting is temporarily unavailable." }, rate.reason === "rate_limited" ? 429 : 503);
  const input = parseJson(await request.json().catch(() => null));
  if (!input || typeof input.reaction !== "string" || !allowed.has(input.reaction) || typeof input.visitorToken !== "string" || input.visitorToken.length < 20 || input.visitorToken.length > 100) {
    return json({ error: "Invalid reaction." }, 400);
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) return json({ error: "Database is not configured." }, 503);
  const visitorHash = scopedVisitorHash(id, input.visitorToken, input.reaction);
  const { error } = await supabase.from("reactions").upsert({
    post_id: id, visitor_hash: visitorHash, reaction_type: input.reaction
  }, { onConflict: "post_id,visitor_hash,reaction_type", ignoreDuplicates: true });
  if (error) return json({ error: "Unable to save reaction." }, 503);
  return json({ ok: true }, 201);
}
