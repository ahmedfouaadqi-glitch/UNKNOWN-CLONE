"use client";

import { useCallback, useEffect, useState } from "react";
import styles from "./admin-panel.module.css";

type SessionStatus = "loading" | "signed_out" | "mfa_setup" | "mfa_pending" | "admin" | "unavailable";
type QueueItem = { id: string; reference?: string; target_type?: "post" | "comment"; target_id?: string; reason?: string; details?: string | null; status?: string; created_at?: string; content?: { title?: string | null; body?: string; category?: string; status?: string } | null };
type PendingPost = { id: string; title: string | null; body: string; category: string; created_at: string };
type PendingComment = { id: string; post_id: string; body: string; created_at: string };
type QueueData = { reports: QueueItem[]; pendingPosts: PendingPost[]; pendingComments: PendingComment[] };
type SetupData = { secret: string; otpauthUri: string; email: string };

const authMessages: Record<string, string> = {
  "access-denied": "هذا الحساب غير مخوّل لإدارة UNKNOWN.",
  "database-unavailable": "تعذر الوصول إلى قاعدة الإدارة. تأكد من تطبيق ترحيل UNKNOWN المعتمد.",
  "identity-mismatch": "هوية الحساب لا تطابق سجل الإدارة؛ أوقفنا تسجيل الدخول احتياطًا.",
  "login-failed": "تعذر إتمام تسجيل الدخول. حاول مرة أخرى.",
  "login-unavailable": "خدمة تسجيل الدخول غير جاهزة حاليًا."
};

function stamp(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : new Intl.DateTimeFormat("ar", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

export function AdminPanel({ authCode }: { authCode?: string }) {
  const [status, setStatus] = useState<SessionStatus>("loading");
  const [email, setEmail] = useState("");
  const [setup, setSetup] = useState<SetupData | null>(null);
  const [queue, setQueue] = useState<QueueData>({ reports: [], pendingPosts: [], pendingComments: [] });
  const [code, setCode] = useState("");
  const [reasons, setReasons] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState(authCode ? authMessages[authCode] || "تعذر التحقق من تسجيل الدخول." : "");
  const [busy, setBusy] = useState(false);

  const loadSession = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/session", { cache: "no-store", credentials: "same-origin" });
      const data = await response.json();
      setStatus(response.status === 503 ? "unavailable" : data.status || "signed_out");
      setEmail(typeof data.email === "string" ? data.email : "");
    } catch {
      setStatus("unavailable");
    }
  }, []);

  const loadQueue = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/queue", { cache: "no-store", credentials: "same-origin" });
      if (!response.ok) throw new Error("تعذر تحميل قائمة الإشراف.");
      setQueue(await response.json());
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "تعذر تحميل قائمة الإشراف.");
    }
  }, []);

  useEffect(() => { void loadSession(); }, [loadSession]);

  useEffect(() => {
    if (status !== "mfa_setup") return;
    let active = true;
    void fetch("/api/admin/mfa/setup", { method: "POST", credentials: "same-origin", cache: "no-store" })
      .then(async response => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "تعذر تجهيز تطبيق المصادقة.");
        if (active) setSetup(data);
      })
      .catch(error => { if (active) setNotice(error instanceof Error ? error.message : "تعذر تجهيز تطبيق المصادقة."); });
    return () => { active = false; };
  }, [status]);

  useEffect(() => { if (status === "admin") void loadQueue(); }, [status, loadQueue]);

  async function startLogin() {
    setBusy(true);
    setNotice("");
    try {
      const response = await fetch("/api/admin/auth/start", { method: "POST", credentials: "same-origin", cache: "no-store" });
      const data = await response.json();
      if (!response.ok || typeof data.authorizationUrl !== "string") throw new Error(data.error || "تعذر بدء تسجيل الدخول.");
      window.location.assign(data.authorizationUrl);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "تعذر بدء تسجيل الدخول.");
      setBusy(false);
    }
  }

  async function verifyCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!/^\d{6}$/.test(code)) return;
    setBusy(true);
    setNotice("");
    try {
      const response = await fetch("/api/admin/mfa/verify", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin", cache: "no-store", body: JSON.stringify({ code }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "تعذر التحقق من الرمز.");
      setCode("");
      setSetup(null);
      await loadSession();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "تعذر التحقق من الرمز.");
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    setBusy(true);
    try {
      await fetch("/api/admin/logout", { method: "POST", credentials: "same-origin", cache: "no-store" });
      setQueue({ reports: [], pendingPosts: [], pendingComments: [] });
      setSetup(null);
      setStatus("signed_out");
      setEmail("");
      setNotice("تم تسجيل الخروج وإبطال الجلسة.");
    } finally {
      setBusy(false);
    }
  }

  async function decide(action: string, key: string, extra: Record<string, string>) {
    const reason = (reasons[key] || "").trim();
    if (reason.length < 8) { setNotice("اكتب سبب القرار بوضوح (8 أحرف على الأقل)."); return; }
    setBusy(true);
    setNotice("");
    try {
      const response = await fetch("/api/admin/queue", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin", cache: "no-store", body: JSON.stringify({ action, reason, ...extra }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "تعذر حفظ القرار.");
      setReasons(current => ({ ...current, [key]: "" }));
      setNotice("تم تسجيل القرار وسببه في سجل الإدارة.");
      await loadQueue();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "تعذر حفظ القرار.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className={styles.shell} dir="rtl" lang="ar">
      <div className={styles.container}>
        <header className={styles.header}>
          <div><span className={styles.kicker}>UNKNOWN · إدارة داخلية</span><h1>لوحة الإدارة</h1><p>وصول محمي للمشرفين المصرّح لهم فقط.</p></div>
          {status === "admin" && <button className={styles.textButton} onClick={() => void logout()} disabled={busy}>تسجيل الخروج</button>}
        </header>

        <div className={styles.safetyNotice} role="note"><strong>حالة النشر:</strong> نشر المحتوى العام معطّل. تتيح هذه اللوحة مراجعة البلاغات ورفض المحتوى أو إزالته فقط، ولا تتيح نشر المشاركات.</div>
        {notice && <div className={styles.notice} role="status">{notice}</div>}
        {status === "loading" && <section className={styles.card} aria-live="polite">جارٍ التحقق من الجلسة…</section>}
        {status === "unavailable" && <section className={styles.card}><h2>لوحة الإدارة غير جاهزة</h2><p>تعذر التحقق من الجلسة أو قاعدة الإدارة. لا يوجد تجاوز محلي للمصادقة.</p></section>}
        {status === "signed_out" && <section className={`${styles.card} ${styles.authCard}`}><span className={styles.kicker}>مصادقة Manus + عامل ثانٍ</span><h2>تسجيل دخول المشرف</h2><p>بعد تسجيل الدخول بحساب Manus المصرّح، سيُطلب رمز TOTP من تطبيق المصادقة. لا تُفتح لوحة الإشراف قبل إتمام الخطوتين.</p><button className={styles.primaryButton} onClick={() => void startLogin()} disabled={busy}>{busy ? "جارٍ التحويل…" : "تسجيل الدخول عبر Manus"}</button></section>}
        {status === "mfa_setup" && <section className={styles.card}><span className={styles.kicker}>إعداد لمرة واحدة</span><h2>فعّل تطبيق المصادقة</h2><p>أضف حسابًا باسم UNKNOWN إلى تطبيق يدعم TOTP، ثم أدخل الرمز المكوّن من 6 أرقام. احتفظ بالمفتاح في مدير كلمات مرور؛ لن يظهر في السجلات.</p>{setup ? <><label className={styles.fieldLabel} htmlFor="totp-secret">المفتاح السري للإدخال اليدوي</label><code id="totp-secret" className={styles.secret}>{setup.secret}</code><p className={styles.muted}>الحساب: {setup.email} · الخوارزمية SHA-1 · رمز من 6 أرقام يتغير كل 30 ثانية</p><form onSubmit={verifyCode} className={styles.verifyForm}><label className={styles.fieldLabel} htmlFor="totp-code">رمز التحقق الأول</label><input id="totp-code" inputMode="numeric" autoComplete="one-time-code" maxLength={6} pattern="[0-9]{6}" value={code} onChange={event => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} className={styles.input} required /><button className={styles.primaryButton} disabled={busy || code.length !== 6}>{busy ? "جارٍ التحقق…" : "تأكيد العامل الثاني"}</button></form></> : <p>جارٍ إعداد المفتاح الآمن…</p>}</section>}
        {status === "mfa_pending" && <section className={styles.card}><span className={styles.kicker}>تحقق متعدد العوامل</span><h2>أدخل رمز TOTP</h2><p>أدخل الرمز الحالي من تطبيق المصادقة. يُرفض الرمز إذا سبق استخدامه.</p><form onSubmit={verifyCode} className={styles.verifyForm}><label className={styles.fieldLabel} htmlFor="totp-code">رمز المصادقة</label><input id="totp-code" inputMode="numeric" autoComplete="one-time-code" maxLength={6} pattern="[0-9]{6}" value={code} onChange={event => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} className={styles.input} required /><button className={styles.primaryButton} disabled={busy || code.length !== 6}>{busy ? "جارٍ التحقق…" : "تحقق وافتح اللوحة"}</button></form></section>}

        {status === "admin" && <>
          <section className={styles.identity}><span>المشرف المسجل</span><strong>{email}</strong><span>الجلسة تنتهي تلقائيًا خلال 8 ساعات أو عند إبطالها.</span></section>
          <section className={styles.section}><div className={styles.sectionHeading}><div><span className={styles.kicker}>بلاغات المجتمع</span><h2>البلاغات المفتوحة ({queue.reports.length})</h2></div><button className={styles.textButton} onClick={() => void loadQueue()}>تحديث</button></div>
            {queue.reports.length === 0 ? <div className={styles.empty}>لا توجد بلاغات مفتوحة.</div> : <div className={styles.list}>{queue.reports.map(item => <article className={styles.item} key={item.id}><div className={styles.itemMeta}><span>السبب: {item.reason || "—"}</span><span>{stamp(item.created_at)}</span></div><p className={styles.body}>{item.content?.body || item.content?.title || "تعذر العثور على المحتوى المرتبط."}</p>{item.details && <p className={styles.details}>{item.details}</p>}<label className={styles.fieldLabel} htmlFor={`reason-${item.id}`}>سبب القرار (يسجل في سجل التدقيق)</label><textarea id={`reason-${item.id}`} className={styles.textarea} value={reasons[item.id] || ""} onChange={event => setReasons(current => ({ ...current, [item.id]: event.target.value }))} maxLength={500} /><div className={styles.actions}><button className={styles.secondaryButton} disabled={busy} onClick={() => void decide("dismiss_report", item.id, { reportId: item.id })}>إغلاق البلاغ دون إجراء على المحتوى</button><button className={styles.dangerButton} disabled={busy} onClick={() => void decide("remove_reported_content", item.id, { reportId: item.id })}>إزالة المحتوى وإغلاق البلاغ</button></div></article>)}</div>}
          </section>
          <section className={styles.section}><div className={styles.sectionHeading}><div><span className={styles.kicker}>مراجعة المحتوى</span><h2>مشاركات معلّقة ({queue.pendingPosts.length})</h2></div></div>
            {queue.pendingPosts.length === 0 ? <div className={styles.empty}>لا توجد مشاركات معلّقة.</div> : <div className={styles.list}>{queue.pendingPosts.map(item => <article className={styles.item} key={item.id}><div className={styles.itemMeta}><span>{item.category}</span><span>{stamp(item.created_at)}</span></div>{item.title && <h3>{item.title}</h3>}<p className={styles.body}>{item.body}</p><label className={styles.fieldLabel} htmlFor={`post-${item.id}`}>سبب الرفض (يسجل في سجل التدقيق)</label><textarea id={`post-${item.id}`} className={styles.textarea} value={reasons[`post:${item.id}`] || ""} onChange={event => setReasons(current => ({ ...current, [`post:${item.id}`]: event.target.value }))} maxLength={500} /><button className={styles.dangerButton} disabled={busy} onClick={() => void decide("reject_content", `post:${item.id}`, { targetType: "post", targetId: item.id })}>رفض المشاركة</button></article>)}</div>}
          </section>
          <section className={styles.section}><div className={styles.sectionHeading}><div><span className={styles.kicker}>مراجعة التعليقات</span><h2>تعليقات معلّقة ({queue.pendingComments.length})</h2></div></div>
            {queue.pendingComments.length === 0 ? <div className={styles.empty}>لا توجد تعليقات معلّقة.</div> : <div className={styles.list}>{queue.pendingComments.map(item => <article className={styles.item} key={item.id}><div className={styles.itemMeta}><span>تعليق على مشاركة · {item.post_id.slice(0, 8)}</span><span>{stamp(item.created_at)}</span></div><p className={styles.body}>{item.body}</p><label className={styles.fieldLabel} htmlFor={`comment-${item.id}`}>سبب الرفض (يسجل في سجل التدقيق)</label><textarea id={`comment-${item.id}`} className={styles.textarea} value={reasons[`comment:${item.id}`] || ""} onChange={event => setReasons(current => ({ ...current, [`comment:${item.id}`]: event.target.value }))} maxLength={500} /><button className={styles.dangerButton} disabled={busy} onClick={() => void decide("reject_content", `comment:${item.id}`, { targetType: "comment", targetId: item.id })}>رفض التعليق</button></article>)}</div>}
          </section>
        </>}
      </div>
    </main>
  );
}
