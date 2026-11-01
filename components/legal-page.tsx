import type { Locale } from "@/lib/i18n";
import type { LegalDocument } from "@/lib/legal";

export function LegalPage({ document, locale }: { document: LegalDocument; locale: Locale }) {
  const ar = locale === "ar";
  return (
    <div className="site-shell">
      <header className="page-intro">
        <span className="eyebrow">{ar ? "غير معروف · الشفافية" : "UNKNOWN · Transparency"}</span>
        <h1 className="page-title">{document.title}</h1>
        <p className="section-description">{document.status}</p>
        <p className="prose">{document.intro}</p>
      </header>
      <article className="prose legal-document" style={{ maxWidth: 850, paddingBlock: 25 }}>
        {document.sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.paragraphs?.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            {section.bullets && <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}
          </section>
        ))}
      </article>
      <p className="writer-note legal-version" style={{ paddingBottom: 36 }}>
        {ar ? "الإصدار 1.0 · آخر تحديث: 1 نوفمبر 2026" : "Edition 1.0 · Last updated: 1 November 2026"}
      </p>
    </div>
  );
}
