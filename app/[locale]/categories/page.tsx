import { notFound } from "next/navigation";
import { isLocale, copy } from "@/lib/i18n";
import { CategoryGrid } from "@/components/category-grid";
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; if (!isLocale(locale)) notFound();
  const ar = locale === "ar"; const t = copy[locale];
  return <div className="site-shell"><header className="page-intro"><span className="eyebrow">{ar ? "ابدأ من الشعور" : "Start with a feeling"}</span><h1 className="page-title">{t.categoriesTitle}</h1><p className="section-description">{t.categoriesDescription}</p></header><div style={{ paddingBottom: 70 }}><CategoryGrid locale={locale}/></div></div>;
}
