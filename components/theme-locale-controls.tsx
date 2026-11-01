"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";

export function ThemeLocaleControls({ locale, pathname }: { locale: Locale; pathname: string }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  useEffect(() => {
    const stored = localStorage.getItem("unknown_theme");
    const initial = stored === "dark" ? "dark" : "light";
    setTheme(initial);
    document.documentElement.dataset.theme = initial;
  }, []);
  function toggleTheme() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    localStorage.setItem("unknown_theme", next);
  }
  const other = locale === "ar" ? "en" : "ar";
  const target = pathname.replace(/^\/(ar|en)(?=\/|$)/, `/${other}`) || `/${other}`;
  return (
    <div className="header-actions">
      <Link className="locale-button" href={target} aria-label={locale === "ar" ? "Switch to English" : "التبديل إلى العربية"}>{other.toUpperCase()}</Link>
      <button className="icon-button" onClick={toggleTheme} aria-label={locale === "ar" ? (theme === "light" ? "تفعيل الوضع الليلي" : "تفعيل الوضع النهاري") : (theme === "light" ? "Enable dark mode" : "Enable light mode")} title={locale === "ar" ? "تغيير المظهر" : "Change appearance"}>
        {theme === "light" ? "☾" : "☼"}
      </button>
    </div>
  );
}
