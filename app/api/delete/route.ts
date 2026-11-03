import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { checkRateLimit } from "@/lib/rate-limit";
import { hashDeletionToken } from "@/lib/crypto";
import { json, parseJson } from "@/lib/http";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const rate = await checkRateLimit(request, "delete", 6, 60 * 60_000);
  if (!rate.allowed) return json({ error: rate.reason === "rate_limited" ? "Too many requests." : "Deletion rate limiting is temporarily unavailable." }, rate.reason === "rate_limited" ? 429 : 503);
  const input = parseJson(await request.json().catch(() => null));
  if (!input || (input.type !== "post" && input.type !== "comment") ||
      typeof input.id !== "string" || !/^[0-9a-f-]{36}$/i.test(input.id) ||
      typeof input.token !== "string" || input.token.length < 30 || input.token.length > 100) {
    return json({ error: "Invalid deletion request." }, 400);
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) return json({ error: "Deletion service is not configured." }, 503);
  const table = input.type === "post" ? "posts" : "comments";
  const { data, error } = await supabase.from(table).delete()
    .eq("id", input.id).eq("deletion_token_hash", hashDeletionToken(input.token)).select("id").maybeSingle();
  if (error || !data) return json({ error: "The content could not be deleted. Check the code and try again." }, 404);
  return json({ deleted: true });
}
