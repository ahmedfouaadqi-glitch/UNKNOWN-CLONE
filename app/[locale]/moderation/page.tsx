import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";

export const metadata = {
  title: "Moderation workspace setup | UNKNOWN",
  robots: { index: false, follow: false }
};

export default async function ModerationWorkspacePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const ar = locale === "ar";
  const cards = ar
    ? [
        { title: "هوية المشرف وصلاحياته", detail: "يتطلب مزوّد هوية موثّقاً، وأدواراً محددة، ومصادقة متعددة العوامل." },
        { title: "قائمة البلاغات", detail: "تتطلب قاعدة بيانات دائمة، وضوابط وصول على مستوى السجل، وتصنيفاً حسب الخطورة." },
        { title: "القرارات وسجل التدقيق", detail: "يجب حفظ هوية المراجع، وسبب القرار، وتوقيته، وأي تغيير في الحالة." },
        { title: "الاعتراض والمراجعة الثانية", detail: "يجب فصل المراجع الثاني عن صاحب القرار الأصلي متى أمكن." }
      ]
    : [
        { title: "Moderator identity and roles", detail: "Requires a verified identity provider, least-privilege roles and multi-factor authentication." },
        { title: "Report queue", detail: "Requires durable storage, row-level access controls and severity triage." },
        { title: "Decisions and audit trail", detail: "Reviewer identity, rationale, timestamp and every state change must be recorded." },
        { title: "Appeals and second review", detail: "A second reviewer should be independent from the original decision-maker where feasible." }
      ];

  return (
    <div className="site-shell">
      <header className="page-intro">
        <span className="eyebrow">{ar ? "مساحة تشغيل داخلية" : "Internal operations"}</span>
        <h1 className="page-title">{ar ? "تهيئة مساحة الإشراف" : "Moderation workspace setup"}</h1>
        <p className="section-description">
          {ar
            ? "هذه صفحة تجهيز للواجهة فقط. لا تعرض بلاغات حقيقية، ولا تمنح صلاحيات، ولا تنفّذ قرارات على المحتوى."
            : "This is a preparation screen only. It does not display real reports, grant access or take action on content."}
        </p>
      </header>

      <section className="workspace-status" aria-live="polite">
        <div>
          <span className="status-kicker">{ar ? "الحالة الحالية" : "Current status"}</span>
          <h2>{ar ? "غير مفعّلة تشغيلياً" : "Not operationally enabled"}</h2>
          <p>{ar
            ? "تم تأجيل ربط قاعدة البيانات كما طلبت. لن تظهر هنا بيانات تجريبية أو أرقام بلاغات مختلقة."
            : "Database integration remains deferred as requested. No sample records or fabricated report counts are shown here."}</p>
        </div>
        <span className="status-pill" aria-label={ar ? "غير مفعّل" : "Disabled"}>{ar ? "غير مفعّل" : "Disabled"}</span>
      </section>

      <section className="readiness-grid" aria-label={ar ? "متطلبات التفعيل" : "Activation requirements"}>
        {cards.map((card, index) => (
          <article className="readiness-card" key={card.title}>
            <span className="readiness-index">0{index + 1}</span>
            <h2>{card.title}</h2>
            <p>{card.detail}</p>
            <span className="readiness-state">{ar ? "بانتظار التنفيذ والاختبار" : "Pending implementation and verification"}</span>
          </article>
        ))}
      </section>

      <div className="notice-box workspace-notice">
        <strong>{ar ? "قيد الحماية" : "Protected by design"}</strong>
        <p>{ar
          ? "لن أضيف كلمة مرور ثابتة داخل الواجهة أو أزراراً شكلية لاتخاذ قرارات إشرافية. التفعيل الصحيح يحتاج مصادقة خادمية، صلاحيات موثوقة، تخزيناً دائماً، وسجل تدقيق قابل للتحقق."
          : "A hard-coded password or decorative moderation buttons would not provide real security. Proper activation requires server-side authentication, trusted roles, durable storage and a verifiable audit trail."}</p>
      </div>
    </div>
  );
}
