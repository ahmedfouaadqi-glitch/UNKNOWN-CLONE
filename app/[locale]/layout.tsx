import { LocaleLayout } from "@/components/locale-layout";

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <LocaleLayout locale={locale}>{children}</LocaleLayout>;
}
