import type { Locale } from "@/lib/i18n";

export function getCountryCode(headers: Pick<Headers, "get">): string | null {
  // These headers must only be trusted when the app is deployed behind the matching
  // CDN/hosting provider, which must overwrite client-supplied copies.
  const raw = headers.get("x-vercel-ip-country") || headers.get("cf-ipcountry");
  if (!raw || raw.toUpperCase() === "XX" || raw.toUpperCase() === "T1") return null;
  const code = raw.trim().toUpperCase();
  return /^[A-Z]{2}$/.test(code) ? code : null;
}

export function getCountryName(code: string | null, locale: Locale): string {
  if (!code) return locale === "ar" ? "العالم" : "the world";
  try {
    const names = new Intl.DisplayNames([locale === "ar" ? "ar" : "en"], { type: "region" });
    return names.of(code) || (locale === "ar" ? "العالم" : "the world");
  } catch {
    return locale === "ar" ? "العالم" : "the world";
  }
}
