import { useEffect, useState, type FormEvent } from "react";
import type { Copy, Locale } from "@/lib/i18n";

type CommentItem = { id: string; body: string; created_at: string };
type Reaction = "care" | "not-alone" | "wish-well";

export function Reactions({ postId, locale, enabled }: { postId: string; locale: Locale; enabled: boolean }) {
  const ar = locale === "ar";
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function refresh() {
    const response = await fetch(`/api/posts/${postId}/reactions`, { cache: "no-store" });
    if (!response.ok) return;
    const data = await response.json();
    setCounts(data.counts || {});
  }

  useEffect(() => { void refresh().catch(() => undefined); }, [postId]);

  async function react(type: Reaction) {
    if (!enabled || busy) return;
    setBusy(true);
    setMessage("");
    try {
      let token = sessionStorage.getItem("unknown_reaction_session");
      if (!token) {
        token = Array.from(crypto.getRandomValues(new Uint8Array(24)))
          .map(value => value.toString(16).padStart(2, "0"))
          .join("");
        sessionStorage.setItem("unknown_reaction_session", token);
      }
      const response = await fetch(`/api/posts/${postId}/reactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reaction: type, visitorToken: token })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || (ar ? "تعذر تسجيل التفاعل." : "Could not save the reaction."));
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : (ar ? "حدث خطأ." : "Something went wrong."));
    } finally {
      setBusy(false);
    }
  }

  const labels: Record<Reaction, string> = {
    care: ar ? "أحس بيك" : "I hear you",
    "not-alone": ar ? "لست وحدك" : "You are not alone",
    "wish-well": ar ? "أتمنى لك الخير" : "Wishing you well"
  };

  return <div className="post-actions" aria-label={ar ? "التفاعلات" : "Reactions"}>
    {(["care", "not-alone", "wish-well"] as Reaction[]).map(type =>
      <button className="reaction-button" key={type} type="button" disabled={!enabled || busy} onClick={() => void react(type)}>
        {labels[type]} <span>{counts[type] || 0}</span>
      </button>
    )}
    {!enabled && <span className="writer-note">{ar ? "التفاعلات غير مفعّلة حالياً." : "Reactions are not enabled yet."}</span>}
    {message && <span className="form-message" role="status">{message}</span>}
  </div>;
}

export function DeleteContent({ locale, type, id, enabled }: { locale: Locale; type: "post" | "comment"; id: string; enabled: boolean }) {
  const ar = locale === "ar";
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function remove() {
    if (!enabled || busy) return;
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, id, token })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || (ar ? "تعذر حذف المحتوى." : "Deletion failed."));
      if (type === "post") window.location.assign("/" + locale);
      else window.location.reload();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : (ar ? "حدث خطأ." : "Something went wrong."));
    } finally {
      setBusy(false);
    }
  }

  return <div className="delete-content-control">
    <button className="report-link" type="button" disabled={!enabled} aria-expanded={open} aria-controls={`delete-panel-${id}`} onClick={() => setOpen(value => !value)}>
      {ar ? "حذف المحتوى برمزك الخاص" : "Delete with your private code"}
    </button>
    {!enabled && <span className="writer-note">{ar ? "خدمة الحذف غير متصلة حالياً." : "Deletion service is not connected yet."}</span>}
    {enabled && open && <div className="report-panel" id={`delete-panel-${id}`}>
      <label className="field-label" htmlFor={`delete-${id}`}>{ar ? "رمز الحذف" : "Deletion code"}</label>
      <input id={`delete-${id}`} className="text-input" autoComplete="off" value={token} onChange={event => setToken(event.target.value)} />
      <button className="secondary-button" type="button" style={{ marginTop: 12 }} disabled={busy || token.length < 30} onClick={() => void remove()}>{ar ? "حذف المحتوى" : "Delete content"}</button>
      {message && <p className="form-message" role="status">{message}</p>}
    </div>}
  </div>;
}

export function Comments({ postId, locale, text, enabled, storageReady }: { postId: string; locale: Locale; text: Copy; enabled: boolean; storageReady: boolean }) {
  const ar = locale === "ar";
  const [items, setItems] = useState<CommentItem[]>([]);
  const [body, setBody] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [adult, setAdult] = useState(false);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [deletionToken, setDeletionToken] = useState("");

  async function refresh() {
    try {
      const response = await fetch(`/api/posts/${postId}/comments`, { cache: "no-store" });
      if (!response.ok) return;
      const data = await response.json();
      setItems(data.comments || []);
    } catch {
      // Preserve the page if comments are unavailable.
    }
  }

  useEffect(() => { void refresh(); }, [postId]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!enabled || !body.trim() || !accepted || !adult) return;
    setBusy(true);
    setStatus("");
    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body, accepted, adult, language: locale })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || (ar ? "تعذر إرسال التعليق." : "The response could not be sent."));
      setBody("");
      setAccepted(false);
      setAdult(false);
      if (data.deletionToken) setDeletionToken(data.deletionToken);
      setStatus(data.status === "pending_review"
        ? (ar ? "تم استلام التعليق وهو بانتظار الفحص." : "Your response is awaiting review.")
        : (ar ? "تم نشر تعليقك." : "Your response was published."));
      await refresh();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : text.genericError);
    } finally {
      setBusy(false);
    }
  }

  return <section className="section">
    <h2 className="section-title">{text.commentsTitle}</h2>
    <div className="comments-list">
      {items.length === 0
        ? <div className="empty-state">{text.noComments}</div>
        : items.map(item => <article className="comment-card" key={item.id}>
          <div className="comment-label">{ar ? "مشاركة من غير معروف" : "Anonymous response"}</div>
          <p className="comment-body">{item.body}</p>
          <div className="comment-tools">
            <a className="report-link" href={`/${locale}/report?targetType=comment&targetId=${item.id}`}>{ar ? "الإبلاغ عن التعليق" : "Report response"}</a>
            <DeleteContent locale={locale} type="comment" id={item.id} enabled={storageReady} />
          </div>
        </article>)}
    </div>
    <form className="writer-panel" onSubmit={submit}>
      <h3 className="writer-label">{text.commentTitle}</h3>
      <textarea className="text-area" value={body} onChange={event => setBody(event.target.value)} maxLength={1500} placeholder={text.commentPlaceholder} required minLength={2} disabled={!enabled || busy} />
      <div className="consent-stack" style={{ marginTop: 14 }}>
        <label className="check-row"><input type="checkbox" checked={accepted} onChange={event => setAccepted(event.target.checked)} disabled={!enabled || busy} /><span>{ar ? "أوافق على قواعد التعليقات وسياسة الخصوصية." : "I agree to the comment rules and privacy notice."} <a href={`/${locale}/community`}>{ar ? "قواعد المجتمع" : "Community rules"}</a></span></label>
        <label className="check-row"><input type="checkbox" checked={adult} onChange={event => setAdult(event.target.checked)} disabled={!enabled || busy} /><span>{ar ? "أؤكد أن عمري 18 عاماً على الأقل." : "I confirm that I am at least 18."}</span></label>
      </div>
      <div className="form-footer">
        <span className="writer-note">{!enabled ? (ar ? "إرسال التعليقات غير مفعّل حالياً." : "Comment submission is currently disabled.") : (ar ? "التعليقات تمر بالفحص قبل ظهورها." : "Responses are checked before publication.")}</span>
        <button className="primary-button" type="submit" disabled={!enabled || busy || !body.trim() || !accepted || !adult}>{busy ? text.publishing : text.commentSubmit}</button>
      </div>
      {status && <p className="form-message" role="status">{status}</p>}
      {deletionToken && <div className="notice-box"><strong>{ar ? "رمز حذف تعليقك، احتفظ به الآن:" : "Save your comment deletion code now:"}</strong><p style={{ overflowWrap: "anywhere", fontFamily: "monospace" }}>{deletionToken}</p></div>}
    </form>
  </section>;
}

export function ReportForm({ locale, initialTargetType = "post", initialTargetId = "", enabled }: { locale: Locale; initialTargetType?: "post" | "comment"; initialTargetId?: string; enabled: boolean }) {
  const ar = locale === "ar";
  const reasons = ["bullying", "threat", "personal_data", "defamation", "hate", "child_safety", "illegal", "other"] as const;
  const labels: Record<(typeof reasons)[number], string> = ar
    ? { bullying: "تنمر أو إهانة", threat: "تهديد أو تحريض", personal_data: "كشف معلومات شخصية", defamation: "تشهير أو اتهام", hate: "خطاب كراهية", child_safety: "سلامة طفل", illegal: "محتوى غير قانوني", other: "سبب آخر" }
    : { bullying: "Bullying or abuse", threat: "Threat or incitement", personal_data: "Private information", defamation: "Defamation or accusation", hate: "Hate speech", child_safety: "Child safety", illegal: "Illegal content", other: "Other" };
  const [targetType, setTargetType] = useState<"post" | "comment">(initialTargetType);
  const [targetId, setTargetId] = useState(initialTargetId);
  const [reason, setReason] = useState<(typeof reasons)[number]>("bullying");
  const [details, setDetails] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!enabled || !targetId.trim() || !confirmed) return;
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetType, targetId, reason, details, confirmed })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || (ar ? "تعذر إرسال البلاغ." : "Report failed."));
      setMessage(ar ? `تم استلام البلاغ. الرقم المرجعي: ${data.reference}` : `Report received. Reference: ${data.reference}`);
      setTargetId("");
      setDetails("");
      setConfirmed(false);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : (ar ? "تعذر إرسال البلاغ." : "Could not submit report."));
    } finally {
      setBusy(false);
    }
  }

  return <form className="writer-panel" onSubmit={submit}>
    <div className="field-row">
      <div><label className="field-label" htmlFor="report-target-type">{ar ? "نوع المحتوى" : "Content type"}</label><select id="report-target-type" className="select-input" value={targetType} onChange={event => setTargetType(event.target.value as "post" | "comment")} disabled={!enabled}><option value="post">{ar ? "مشاركة" : "Post"}</option><option value="comment">{ar ? "تعليق" : "Comment"}</option></select></div>
      <div><label className="field-label" htmlFor="report-target-id">{ar ? "معرّف المحتوى" : "Content ID"}</label><input id="report-target-id" className="text-input" value={targetId} onChange={event => setTargetId(event.target.value)} placeholder="UUID" required disabled={!enabled}/></div>
    </div>
    <div style={{ marginTop: 15 }}><label className="field-label" htmlFor="report-reason">{ar ? "سبب الإبلاغ" : "Reason"}</label><select id="report-reason" className="select-input" value={reason} onChange={event => setReason(event.target.value as (typeof reasons)[number])} disabled={!enabled}>{reasons.map(key => <option key={key} value={key}>{labels[key]}</option>)}</select></div>
    <div style={{ marginTop: 15 }}><label className="field-label" htmlFor="report-details">{ar ? "تفاصيل إضافية (اختياري)" : "Additional details (optional)"}</label><textarea id="report-details" className="text-area" style={{ minHeight: 100 }} maxLength={1000} value={details} onChange={event => setDetails(event.target.value)} disabled={!enabled}/></div>
    <label className="check-row" style={{ marginTop: 15 }}><input type="checkbox" checked={confirmed} onChange={event => setConfirmed(event.target.checked)} disabled={!enabled}/><span>{ar ? "أؤكد أن البلاغ يتعلق بمحتوى محدد، وأن المعلومات التي قدمتها دقيقة بحسب علمي." : "I confirm this report concerns specific content and is accurate to the best of my knowledge."}</span></label>
    <div className="form-footer"><span className="writer-note">{!enabled ? (ar ? "استقبال البلاغات غير متصل حتى الآن." : "Report intake is not connected yet.") : (ar ? "لا تضع معلومات شخصية غير ضرورية." : "Do not include unnecessary personal information.")}</span><button className="primary-button" disabled={!enabled || busy || !targetId.trim() || !confirmed}>{busy ? "…" : (ar ? "إرسال البلاغ" : "Submit report")}</button></div>
    {message && <p className="form-message" role="status">{message}</p>}
  </form>;
}
