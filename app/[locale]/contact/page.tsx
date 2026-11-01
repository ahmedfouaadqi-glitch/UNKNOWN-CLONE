import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { operatorInfo } from "@/lib/operator";

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const ar = locale === "ar";

  return (
    <div className="site-shell">
      <header className="page-intro">
        <span className="eyebrow">{ar ? "بيانات المشغّل وقنوات التواصل" : "Operator details and contact channels"}</span>
        <h1 className="page-title">{ar ? "التواصل مع غير معروف" : "Contact UNKNOWN"}</h1>
        <p className="section-description">{ar
          ? "بيانات المشغّل وقناة التواصل الرسمية للمراسلات العامة والخصوصية والسلامة والإشعارات القانونية."
          : "The published operator details and official channel for general, privacy, safety and legal correspondence."}</p>
      </header>

      <section className="contact-channel-grid">
        <article className="country-card">
          <span className="writer-note">{ar ? "مشغّل الخدمة" : "Service operator"}</span>
          <h2 className="post-title">{ar ? operatorInfo.nameAr : operatorInfo.nameEn}</h2>
          <p className="section-description">{ar ? operatorInfo.locationAr : operatorInfo.locationEn}</p>
        </article>
        <article className="country-card">
          <span className="writer-note">{ar ? "البريد الرسمي" : "Official email"}</span>
          <h2 className="post-title operator-contact-value">{operatorInfo.email}</h2>
          <p className="section-description">{ar
            ? "يُستخدم هذا البريد للاستفسارات العامة وطلبات الخصوصية والبلاغات والمراسلات القانونية."
            : "This mailbox receives general enquiries, privacy requests, safety reports and legal notices."}</p>
          <a className="contact-channel-link" href={`mailto:${operatorInfo.email}`}>{ar ? "إرسال بريد إلكتروني" : "Send email"} ↗</a>
        </article>
        <article className="country-card">
          <span className="writer-note">{ar ? "الهاتف" : "Telephone"}</span>
          <h2 className="post-title operator-contact-value" dir="ltr">{operatorInfo.phone}</h2>
          <a className="contact-channel-link" href={`tel:${operatorInfo.phone}`}>{ar ? "اتصال هاتفي" : "Call"} ↗</a>
        </article>
        <article className="country-card">
          <span className="writer-note">WhatsApp</span>
          <h2 className="post-title operator-contact-value" dir="ltr">{operatorInfo.phone}</h2>
          <a className="contact-channel-link" href={operatorInfo.whatsappUrl} target="_blank" rel="noopener noreferrer">
            {ar ? "فتح محادثة واتساب" : "Open WhatsApp chat"} ↗
          </a>
        </article>
      </section>

      <div className="notice-box contact-emergency-note" style={{ marginBottom: 70 }}>
        {ar
          ? "هذه القنوات ليست خدمة طوارئ أو خطاً ساخناً يعمل على مدار الساعة. عند وجود خطر مباشر، تواصل مع خدمات الطوارئ المحلية ولا تنتظر رداً من الموقع."
          : "These channels are not emergency services or a 24/7 crisis hotline. In immediate danger, contact local emergency services rather than waiting for a website response."}
      </div>
    </div>
  );
}
