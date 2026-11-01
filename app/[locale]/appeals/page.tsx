import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";

export const metadata = {
  title: "Appeals information | UNKNOWN",
  robots: { index: false, follow: false }
};

export default async function AppealsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const ar = locale === "ar";
  const steps = ar
    ? [
        ["01", "تقديم الاعتراض", "يُربط الاعتراض بمرجع قرار محدد، دون طلب بيانات شخصية لا لزوم لها."],
        ["02", "التحقق من الأهلية", "يُتحقق من أن الطلب يخص قراراً قابلاً للمراجعة، مع منع كشف بيانات المبلّغ."],
        ["03", "مراجعة مستقلة", "يُحال الطلب إلى مراجع آخر متى أمكن، مع الاطلاع على الأدلة الضرورية فقط."],
        ["04", "إبلاغ النتيجة", "تُسجل النتيجة وأسبابها وتاريخها، ثم يُبلّغ صاحب الطلب عبر قناة آمنة."]
      ]
    : [
        ["01", "Submit an appeal", "The appeal is tied to a specific decision reference and avoids unnecessary personal data."],
        ["02", "Check eligibility", "The request is checked against an appealable decision without exposing reporter details."],
        ["03", "Independent review", "Where feasible, another reviewer examines only the evidence required for reconsideration."],
        ["04", "Notify the outcome", "The outcome, rationale and date are recorded, then communicated through a secure channel."]
      ];

  return (
    <div className="site-shell">
      <header className="page-intro">
        <span className="eyebrow">{ar ? "الإنصاف والمراجعة" : "Fairness and review"}</span>
        <h1 className="page-title">{ar ? "الاعتراض على قرار" : "Appeal a decision"}</h1>
        <p className="section-description">
          {ar
            ? "يجب أن يكون لكل قرار إشرافي مؤثر مسار مراجعة واضح، مع توثيق السبب وإتاحة فرصة لإعادة النظر."
            : "Material moderation decisions should have a clear review path, documented reasons and a meaningful opportunity for reconsideration."}
        </p>
      </header>

      <section className="workspace-status appeal-status">
        <div>
          <span className="status-kicker">{ar ? "حالة الخدمة" : "Service status"}</span>
          <h2>{ar ? "استقبال الاعتراضات غير متاح بعد" : "Appeal submissions are not open yet"}</h2>
          <p>{ar
            ? "هذه الصفحة تشرح المسار المستهدف فقط. لا يوجد نموذج إرسال أو حفظ في الوقت الحالي؛ لا تضع تفاصيل حساسة هنا."
            : "This page explains the intended process only. There is no submission or storage workflow yet; do not enter sensitive details here."}</p>
        </div>
        <span className="status-pill">{ar ? "قيد التجهيز" : "In preparation"}</span>
      </section>

      <section className="appeal-steps" aria-label={ar ? "خطوات الاعتراض" : "Appeal steps"}>
        {steps.map(([number, title, detail]) => (
          <article className="appeal-step" key={number}>
            <span className="readiness-index">{number}</span>
            <div><h2>{title}</h2><p>{detail}</p></div>
          </article>
        ))}
      </section>

      <div className="notice-box workspace-notice">
        <strong>{ar ? "متى يفتح المسار؟" : "When will this open?"}</strong>
        <p>{ar
          ? "بعد تنفيذ تسجيل الدخول والصلاحيات، وربط الاعتراضات بقاعدة البيانات، وإكمال الإشعارات وسجل التدقيق واختبار دورة الاعتراض كاملة."
          : "After authentication and authorization, database persistence, notices and audit logging are implemented and the complete appeal lifecycle is tested."}</p>
      </div>
    </div>
  );
}
