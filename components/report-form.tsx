"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";

const reasons = ["bullying", "threat", "personal_data", "defamation", "hate", "child_safety", "illegal", "other"] as const;
export function ReportForm({ locale, initialTargetType = "post", initialTargetId = "" }: { locale: Locale; initialTargetType?: "post" | "comment"; initialTargetId?: string }) {
  const ar = locale === "ar";
  const [targetType, setTargetType] = useState<"post" | "comment">(initialTargetType);
  const [targetId, setTargetId] = useState(initialTargetId);
  const [reason, setReason] = useState<string>("bullying");
  const [details, setDetails] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const labels: Record<string, string> = ar
    ? { bullying: "تنمر أو إهانة", threat: "تهديد أو تحريض", personal_data: "كشف معلومات شخصية", defamation: "تشهير أو اتهام", hate: "خطاب كراهية", child_safety: "سلامة طفل", illegal: "محتوى غير قانوني", other: "سبب آخر" }
    : { bullying: "Bullying or abuse", threat: "Threat or incitement", personal_data: "Private information", defamation: "Defamation or accusation", hate: "Hate speech", child_safety: "Child safety", illegal: "Illegal content", other: "Other" };
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!targetId.trim() || !confirmed) return;
    setBusy(true); setMessage("");
    try {
      const res = await fetch("/api/reports", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ targetType, targetId, reason, details, confirmed }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Report failed");
      setMessage(ar ? `تم استلام البلاغ. الرقم المرجعي: ${data.reference}` : `Report received. Reference: ${data.reference}`);
      setTargetId(""); setDetails(""); setConfirmed(false);
    } catch (error) { setMessage(error instanceof Error ? error.message : (ar ? "تعذر إرسال البلاغ." : "Could not submit report.")); }
    finally { setBusy(false); }
  }
  return <form className="writer-panel" onSubmit={submit}>
    <div className="field-row">
      <div><label className="field-label" htmlFor="report-target-type">{ar ? "نوع المحتوى" : "Content type"}</label><select id="report-target-type" className="select-input" value={targetType} onChange={(e) => setTargetType(e.target.value as "post" | "comment")}><option value="post">{ar ? "مشاركة" : "Post"}</option><option value="comment">{ar ? "تعليق" : "Comment"}</option></select></div>
      <div><label className="field-label" htmlFor="report-target-id">{ar ? "معرّف المحتوى" : "Content ID"}</label><input id="report-target-id" className="text-input" value={targetId} onChange={(e) => setTargetId(e.target.value)} placeholder="UUID" required /></div>
    </div>
    <div style={{ marginTop: 15 }}><label className="field-label">{ar ? "سبب الإبلاغ" : "Reason"}</label><select className="select-input" value={reason} onChange={(e) => setReason(e.target.value)}>{reasons.map((key) => <option key={key} value={key}>{labels[key]}</option>)}</select></div>
    <div style={{ marginTop: 15 }}><label className="field-label">{ar ? "تفاصيل إضافية (اختياري)" : "Additional details (optional)"}</label><textarea className="text-area" style={{ minHeight: 100 }} maxLength={1000} value={details} onChange={(e) => setDetails(e.target.value)} /></div>
    <label className="check-row" style={{ marginTop: 15 }}><input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} /><span>{ar ? "أؤكد أن البلاغ يتعلق بمحتوى محدد، وأن المعلومات التي قدمتها دقيقة بحسب علمي." : "I confirm this report concerns specific content and is accurate to the best of my knowledge."}</span></label>
    <div className="form-footer"><span className="writer-note">{ar ? "لا تضع معلومات شخصية غير ضرورية." : "Do not include unnecessary personal information."}</span><button className="primary-button" disabled={busy || !targetId.trim() || !confirmed}>{busy ? "…" : (ar ? "إرسال البلاغ" : "Submit report")}</button></div>
    {message && <p className="form-message" role="status">{message}</p>}
  </form>;
}
