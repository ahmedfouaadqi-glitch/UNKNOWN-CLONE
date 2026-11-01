import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { findJurisdiction } from "@/lib/jurisdictions";

export default async function CountryLegalPage({ params }: { params: Promise<{ locale: string; country: string }> }) {
  const { locale, country } = await params;
  if (!isLocale(locale)) notFound();
  const item = findJurisdiction(country.toUpperCase());
  if (!item) notFound();
  const ar = locale === "ar";

  const kindLabel = (kind: string) => {
    if (ar) {
      if (kind === "binding-law") return "قانون أو تشريع";
      if (kind === "regulation") return "لائحة أو قرار تنظيمي";
      if (kind === "consultation") return "استشارة عامة — ليست لائحة نهائية نافذة";
      return "مصدر أو إرشاد رسمي";
    }
    if (kind === "binding-law") return "Statute";
    if (kind === "regulation") return "Regulation";
    if (kind === "consultation") return "Consultation — not a final regulation in force";
    return "Official source or guidance";
  };

  return (
    <div className="site-shell">
      <header className="page-intro">
        <span className="eyebrow">{ar ? "المراجع القانونية الرسمية" : "Official legal references"}</span>
        <h1 className="page-title">{item.name}</h1>
        <p className="section-description">{item.code} · {ar ? "الإتاحة: مفتوحة افتراضياً" : "Availability: open by default"}</p>
      </header>

      <section className="workspace-status">
        <div>
          <span className="status-kicker">{ar ? "حالة السوق" : "Market status"}</span>
          <h2>{ar ? "الإتاحة العالمية هي الأصل" : "Global availability is the default"}</h2>
          <p>{ar ? item.noteAr : item.noteEn}</p>
        </div>
        <span className="status-pill">{ar ? "مفتوح افتراضياً" : "Open by default"}</span>
      </section>

      <section className="legal-sources-section">
        <div className="section-heading">
          <div>
            <h2 className="section-title">{ar ? "القوانين واللوائح والمصادر" : "Laws, regulations and sources"}</h2>
            <p className="section-description">
              {ar ? "روابط إلى الجهات التشريعية والتنظيمية الرسمية. إدراج الدولة لا يحجبها جغرافياً؛ وتُراجع أي قيود وفق سندها ونطاقها." : "Links to official legislative and regulatory sources. Listing a country does not geo-block it; any restriction must be assessed against its legal basis and scope."}
            </p>
          </div>
        </div>
        <div className="legal-reference-list">
          {item.references.map((reference) => (
            <article className="legal-reference-card" key={reference.id}>
              <div className="legal-reference-meta"><span className="status-pill">{kindLabel(reference.kind)}</span></div>
              <h3>{ar ? reference.titleAr : reference.titleEn}</h3>
              <p>{ar ? reference.noteAr : reference.noteEn}</p>
              <a href={reference.url} target="_blank" rel="noopener noreferrer">{ar ? "فتح المصدر الرسمي" : "Open official source"} ↗</a>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">{ar ? "الموضوعات التي يجب حسمها" : "Issues to resolve before activation"}</h2>
        <ul className="legal-topic-list">{item.topics.map((topic) => <li key={topic.en}>{ar ? topic.ar : topic.en}</li>)}</ul>
      </section>

      <div className="notice-box legal-scope-note">
        <strong>{ar ? "حدود هذه الصفحة" : "Scope of this page"}</strong>
        <p>{ar
          ? "هذه الصفحة فهرس مصادر قانونية مرتبطة بالدولة. إدراج رابط لا يعني تلقائياً أن كل حكم ينطبق على غير معروف، ولا يثبت الحصول على ترخيص أو استيفاء متطلبات الدولة. يتحدد ذلك من طبيعة الخدمة ووقائع تشغيلها والنصوص النافذة."
          : "This page is a country-specific index of legal sources. Listing a source does not mean every provision automatically applies to UNKNOWN, and it does not establish a licence or regulatory compliance. Applicability depends on the actual service, its operation and the laws in force."}</p>
      </div>
    </div>
  );
}
