import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { defaultLocaleForCountry, isLocale } from "@/lib/i18n";
import { getCountryCode } from "@/lib/countries";

export const dynamic = "force-dynamic";

export default async function RootPage() {
  const [cookieStore, headerStore] = await Promise.all([cookies(), headers()]);
  const saved = cookieStore.get("unknown_locale")?.value;
  if (isLocale(saved)) redirect(`/${saved}`);
  const country = getCountryCode(headerStore);
  const locale = defaultLocaleForCountry(country, headerStore.get("accept-language") || "");
  redirect(`/${locale}`);
}
