import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { getLegalDocument } from "@/lib/legal";
import { LegalPage } from "@/components/legal-page";
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; if (!isLocale(locale)) notFound();
  const document = getLegalDocument("privacy", locale); if (!document) notFound();
  return <LegalPage document={document} locale={locale} />;
}
