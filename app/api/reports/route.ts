import { randomUUID } from "node:crypto";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { checkRateLimit } from "@/lib/rate-limit";
import { cleanText, json, parseJson } from "@/lib/http";

export const runtime = "nodejs";
const reasons = new Set(["bullying","threat","personal_data","defamation","hate","child_safety","illegal","other"]);

export async function POST(request: Request) {
  const rate = checkRateLimit(request, "reports", 5, 60 * 60_000);
  if (!rate.allowed) return json({ error: "Report rate limit reached." }, 429);
  const input = parseJson(await request.json().catch(() => null));
  if (!input || (input.targetType !== "post" && input.targetType !== "comment") ||
      typeof input.targetId !== "string" || !/^[0-9a-f-]{36}$/i.test(input.targetId) ||
      typeof input.reason !== "string" || !reasons.has(input.reason) || input.confirmed !== true) {
    return json({ error: "Invalid report details." }, 400);
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) return json({ error: "Reporting service is not configured." }, 503);
  const table = input.targetType === "post" ? "posts" : "comments";
  const { data: target } = await supabase.from(table).select("id").eq("id", input.targetId).maybeSingle();
  if (!target) return json({ error: "The reported content was not found." }, 404);
  const reference = randomUUID();
  const { error } = await supabase.from("reports").insert({
    reference, target_type: input.targetType, target_id: input.targetId,
    reason: input.reason, details: cleanText(input.details, 1000), status: "open"
  });
  if (error) return json({ error: "Unable to record report." }, 503);
  return json({ reference }, 201);
}
