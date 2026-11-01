import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { priorityJurisdictions } from "@/lib/jurisdictions";

export function JurisdictionLinks({ locale }: { locale: Locale }) {
  const ar = locale === "ar";
  return (
    <div className="country-grid">
      {priorityJurisdictions.map((item) => (
        <Link className="country-card" key={item.code} href={`/${locale}/legal/${item.code.toLowerCase()}`}>
          <span className="writer-note">{item.code}</span>
          <h3 className="post-title" style={{ marginTop: 8 }}>{item.name}</h3>
          <span className="writer-note">{ar ? "الإتاحة العالمية افتراضياً" : "Globally available by default"}</span>
          <span className="writer-note">{ar ? `${item.references.length} مصادر ومراجع رسمية` : `${item.references.length} official sources and references`}</span>
        </Link>
      ))}
    </div>
  );
}
