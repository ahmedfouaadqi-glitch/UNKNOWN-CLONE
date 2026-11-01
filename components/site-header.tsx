"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brand } from "@/components/brand";
import { ThemeLocaleControls } from "@/components/theme-locale-controls";
import type { Locale, Copy } from "@/lib/i18n";

export function SiteHeader({ locale, copy }: { locale: Locale; copy: Copy }) {
  const [open, setOpen] = useState(false);
  const prefix = `/${locale}`;
  const pathname = usePathname() || prefix;
  return (
    <header className="site-header">
      <div className="site-shell">
        <div className="header-inner">
          <Brand locale={locale} />
          <nav className="nav-links" aria-label={locale === "ar" ? "التنقل الرئيسي" : "Main navigation"}>
            <Link href={`${prefix}/latest`}>{copy.nav.latest}</Link>
            <Link href={`${prefix}/categories`}>{copy.nav.categories}</Link>
            <Link href={`${prefix}/search`}>{copy.nav.search}</Link>
            <Link href={`${prefix}/about`}>{copy.nav.about}</Link>
            <Link href={`${prefix}/legal`}>{copy.nav.legal}</Link>
          </nav>
          <div className="header-actions">
            <ThemeLocaleControls locale={locale} pathname={pathname} />
            <button className="menu-button" aria-controls="mobile-navigation" aria-expanded={open} aria-label={open ? (locale === "ar" ? "إغلاق القائمة" : "Close menu") : (locale === "ar" ? "فتح القائمة" : "Open menu")} onClick={() => setOpen((value) => !value)}>
              {open ? "×" : "☰"}
            </button>
          </div>
        </div>
        {open && <nav id="mobile-navigation" className="mobile-nav" aria-label={locale === "ar" ? "قائمة الهاتف" : "Mobile navigation"}>
          <Link onClick={() => setOpen(false)} href={`${prefix}/latest`}>{copy.nav.latest}</Link>
          <Link onClick={() => setOpen(false)} href={`${prefix}/categories`}>{copy.nav.categories}</Link>
          <Link onClick={() => setOpen(false)} href={`${prefix}/search`}>{copy.nav.search}</Link>
          <Link onClick={() => setOpen(false)} href={`${prefix}/about`}>{copy.nav.about}</Link>
          <Link onClick={() => setOpen(false)} href={`${prefix}/legal`}>{copy.nav.legal}</Link>
        </nav>}
      </div>
    </header>
  );
}
