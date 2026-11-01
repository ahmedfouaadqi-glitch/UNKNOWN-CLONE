import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { getLegalDocument } from "@/lib/legal";
import { LegalPage } from "@/components/legal-page";
import { JurisdictionLinks } from "@/components/jurisdiction-links";
import { internationalReferences } from "@/lib/jurisdictions";

export default async function LegalCenterPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const document = getLegalDocument("legal", locale);
  if (!document) notFound();
  const ar = locale === "ar";

  return (
    <>
      <LegalPage document={document} locale={locale} />
      <section className="site-shell section legal-sources-section">
        <div className="section-heading">
          <div>
            <h2 className="section-title">{ar ? "المراجع الدولية" : "International references"}</h2>
            <p className="section-description">{ar ? "مصادر أممية أساسية تتصل بالحقوق والخصوصية وحرية التعبير وحماية الطفل." : "Core United Nations sources relevant to rights, privacy, freedom of expression and child protection."}</p>
          </div>
        </div>
        <div className="legal-reference-list">
          {internationalReferences.map((reference) => (
            <article className="legal-reference-card" key={reference.id}>
              <span className="status-pill">{ar ? (reference.kind === "binding-law" ? "معاهدة دولية" : "إعلان دولي") : (reference.kind === "binding-law" ? "International treaty" : "International declaration")}</span>
              <h3>{ar ? reference.titleAr : reference.titleEn}</h3>
              <p>{ar ? reference.noteAr : reference.noteEn}</p>
              <a href={reference.url} target="_blank" rel="noopener noreferrer">{ar ? "فتح المصدر" : "Open source"} ↗</a>
            </article>
          ))}
        </div>
      </section>

      <section className="site-shell section">
        <div className="section-heading">
          <div>
            <h2 className="section-title">{ar ? "سجل الدول والأسواق" : "Country and market register"}</h2>
            <p className="section-description">{ar
              ? "الإتاحة العالمية هي الوضع الافتراضي ولا تُحجب دولة لمجرد إدراجها في هذا السجل. تعرض الصفحات النصوص الرسمية والواجبات التي قد تنطبق على الخدمة."
              : "Global availability is the default. A country is not geo-blocked merely because it appears in this register. Country pages list official texts and duties that may apply to the service."}</p>
          </div>
        </div>
        <JurisdictionLinks locale={locale} />
      </section>
    </>
  );
}
