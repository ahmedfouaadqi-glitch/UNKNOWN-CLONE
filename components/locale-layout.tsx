import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { isLocale, type Locale, copy } from "@/lib/i18n";
import { getCountryCode, getCountryName } from "@/lib/countries";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { DocumentLocale } from "@/components/document-locale";

export async function LocaleLayout({ locale, children }: { locale: string; children: ReactNode }) {
  if (!isLocale(locale)) notFound();
  const current = locale as Locale;
  const headerStore = await headers();
  const countryName = getCountryName(getCountryCode(headerStore), current);
  return (
    <div lang={current} dir={current === "ar" ? "rtl" : "ltr"}>
      <DocumentLocale locale={current} />
      <a className="skip-link" href="#main-content">{current === "ar" ? "تجاوز إلى المحتوى" : "Skip to content"}</a>
      <SiteHeader locale={current} copy={copy[current]} />
      <main id="main-content" tabIndex={-1}>{children}</main>
      <SiteFooter locale={current} copy={copy[current]} />
      <span className="sr-only" aria-live="polite">{current === "ar" ? "زائر من " : "Visitor from "}{countryName}</span>
    </div>
  );
}
