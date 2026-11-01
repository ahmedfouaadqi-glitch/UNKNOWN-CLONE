import { useState, type FormEvent } from "react";
import type { Copy, Locale } from "@/lib/i18n";
import { categories } from "@/lib/categories";

export function PublishForm({ locale, text, enabled }: { locale: Locale; text: Copy; enabled: boolean }) {
  const ar = locale === "ar";
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [adult, setAdult] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [kind, setKind] = useState<"error" | "success" | "info">("info");
  const [deletionToken, setDeletionToken] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!enabled || body.trim().length < 8 || !category || !accepted || !adult) {
      setKind("error");
      setMessage(enabled ? text.required : (ar ? "النشر غير مفعّل حالياً." : "Publishing is not enabled yet."));
      return;
    }
    setBusy(true);
    setMessage(text.publishing);
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title, body, category, language: locale,
          acceptedTerms: accepted,
          acceptedPrivacy: accepted,
          acceptedDisclaimer: accepted,
          confirmedAdult: adult
        })
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        const reason = payload.code === "market_disabled" || payload.code === "database_not_configured"
          ? text.configError
          : payload.code === "moderation_review" || payload.code === "moderation_rejected"
            ? text.moderationBlocked
            : (payload.error || text.genericError);
        throw new Error(reason);
      }
      setKind("success");
      setMessage(payload.status === "pending_review" ? text.pending : text.success);
      if (payload.deletionToken) setDeletionToken(payload.deletionToken);
      setTitle("");
      setBody("");
      setCategory("");
      setAccepted(false);
      setAdult(false);
    } catch (error) {
      setKind("error");
      setMessage(error instanceof Error ? error.message : text.genericError);
    } finally {
      setBusy(false);
    }
  }

  async function copyToken() {
    try {
      await navigator.clipboard.writeText(deletionToken);
      setMessage(text.copied);
    } catch {
      setMessage(deletionToken);
    }
  }

  return <form className="writer-panel" onSubmit={submit}>
    <div className="writer-topline"><div className="writer-label">{text.writeTitle}</div><div className="writer-note">{text.submitHint}</div></div>
    <input className="text-input" maxLength={100} value={title} onChange={event => setTitle(event.target.value)} placeholder={text.titlePlaceholder} aria-label={text.titlePlaceholder} disabled={!enabled || busy}/>
    <div style={{ marginTop: 12 }}>
      <textarea className="text-area" maxLength={5000} value={body} onChange={event => setBody(event.target.value)} placeholder={text.writePlaceholder} aria-label={text.writePlaceholder} required minLength={8} disabled={!enabled || busy}/>
      <div className="form-footer" style={{ marginTop: 7 }}><span className="writer-note">{body.length}/5000 {text.chars}</span><span className="writer-note">{text.writeHint}</span></div>
    </div>
    <div className="field-row">
      <div><label className="field-label" htmlFor="unknown-category">{text.categoryLabel}</label><select id="unknown-category" className="select-input" value={category} onChange={event => setCategory(event.target.value)} required disabled={!enabled || busy}><option value="">{text.categoryPlaceholder}</option>{categories.map(item => <option key={item.id} value={item.id}>{item[locale]}</option>)}</select></div>
      <div className="notice-box" style={{ display: "flex", alignItems: "center" }}>{ar ? "تُعرض المشاركات للعامة بعد اجتياز الفحص." : "Stories become public only after passing checks."}</div>
    </div>
    <div className="consent-stack" style={{ marginTop: 20 }}>
      <label className="check-row"><input type="checkbox" checked={accepted} onChange={event => setAccepted(event.target.checked)} disabled={!enabled || busy}/><span>{text.consent} <a href={`/${locale}/terms`}>{ar ? "الشروط" : "Terms"}</a> · <a href={`/${locale}/privacy`}>{ar ? "الخصوصية" : "Privacy"}</a> · <a href={`/${locale}/disclaimer`}>{ar ? "إخلاء المسؤولية" : "Disclaimer"}</a></span></label>
      <label className="check-row"><input type="checkbox" checked={adult} onChange={event => setAdult(event.target.checked)} disabled={!enabled || busy}/><span>{text.age}</span></label>
      <p className="writer-note" style={{ margin: 0 }}>{ar ? "إقرار العمر تصريح ذاتي وليس خدمة تحقق من العمر. لا تشارك بيانات تكشف هويتك." : "Age confirmation is self-declared, not age verification. Do not include identifying details."}</p>
    </div>
    <div className="form-footer"><span className="writer-note">{enabled ? (ar ? "لن يظهر اسمك أو بلدك مع المشاركة." : "Your name or detected country will not appear with the story.") : (ar ? "التصفح متاح. استقبال المشاركات غير مفعّل حتى اكتمال شروط التخزين والسلامة." : "Browsing is available. Submissions remain closed until storage and safety gates are complete.")}</span><button className="primary-button" type="submit" disabled={!enabled || busy || !body.trim() || !category || !accepted || !adult}>{busy ? text.publishing : (enabled ? text.publish : (ar ? "النشر غير مفعّل" : "Publishing is disabled"))} <span aria-hidden="true">↗</span></button></div>
    {message && <p className={`form-message ${kind}`} role="status">{message}</p>}
    {deletionToken && <div className="notice-box" style={{ marginTop: 12 }}><strong>{text.deleteToken}</strong><p style={{ overflowWrap: "anywhere", fontFamily: "monospace" }}>{deletionToken}</p><button className="secondary-button" type="button" onClick={() => void copyToken()}>{text.copy}</button></div>}
  </form>;
}
