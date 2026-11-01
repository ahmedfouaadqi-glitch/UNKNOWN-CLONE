import Link from "next/link";
import type { Locale } from "@/lib/i18n";

export function BrandMark({ size = 42, decorative = false }: { size?: number; decorative?: boolean }) {
  return <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden={decorative} role={decorative ? undefined : "img"} aria-label={decorative ? undefined : "UNKNOWN logo mark"} className="brand-mark" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M25 20c-5 0-8 4-8 9v43c0 5 4 9 9 9h47c5 0 9-4 9-9V30c0-5-4-10-9-10H25Z" opacity=".35"/>
    <path d="M28 28v40c0 4 3 7 7 7h36c4 0 7-3 7-7V31c0-4-3-7-7-7H35"/>
    <path d="m39 43 11-9 10 9M40 52h20M40 61h13"/>
    <path d="m59 79 21-21 7 7-21 21-11 4 4-11ZM76 62l7 7"/>
  </svg>;
}
export function Brand({ locale, compact = false }: { locale: Locale; compact?: boolean }) {
  return <Link href={`/${locale}`} className="brand-link" aria-label={locale === "ar" ? "غير معروف - الصفحة الرئيسية" : "UNKNOWN home"}>
    <BrandMark/><span className="brand-copy"><span className="brand-name">UNKNOWN<span aria-hidden="true">.</span></span>{!compact && <span className="brand-ar" lang="ar" dir="rtl">غير معروف</span>}</span>
  </Link>;
}
