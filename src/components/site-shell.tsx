import { useEffect, useState, type ReactNode } from "react";
import type { Copy, Locale } from "@/lib/i18n";
import { copy } from "@/lib/i18n";

function Brand({ locale }: { locale: Locale }) {
  return (
    <a className="brand-link" href={"/" + locale} aria-label={locale === "ar" ? "غير معروف - الرئيسية" : "UNKNOWN home"}>
      <img className="brand-mark" src="/brand/unknown-mark.svg" alt="" width="42" height="42" />
      <span className="brand-copy"><span className="brand-name">UNKNOWN<span aria-hidden="true">.</span></span><span className="brand-ar" lang="ar" dir="rtl">غير معروف</span></span>
    </a>
  );
}

function ThemeLocaleControls({ locale }: { locale: Locale }) {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    try {
      const enabled = window.localStorage.getItem("unknown-theme") === "dark";
      setDark(enabled);
      document.documentElement.dataset.theme = enabled ? "dark" : "light";
    } catch {
      document.documentElement.dataset.theme = "light";
    }
  }, []);
  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    try { window.localStorage.setItem("unknown-theme", next ? "dark" : "light"); } catch { /* local storage may be unavailable */ }
  }
  const other = locale === "ar" ? "en" : "ar";
  return <div className="header-actions">
    <button className="icon-button" type="button" onClick={toggleTheme} aria-label={dark ? (locale === "ar" ? "الوضع النهاري" : "Light mode") : (locale === "ar" ? "الوضع الليلي" : "Dark mode")}>{dark ? "☼" : "◐"}</button>
    <a className="locale-button" href={"/" + other} lang={other}>{other === "ar" ? "عربي" : "EN"}</a>
  </div>;
}

function SiteHeader({ locale, text }: { locale: Locale; text: Copy }) {
  const [open, setOpen] = useState(false);
  const prefix = "/" + locale;
  const links = [
    [prefix + "/latest", text.nav.latest],
    [prefix + "/categories", text.nav.categories],
    [prefix + "/search", text.nav.search],
    [prefix + "/about", text.nav.about],
    [prefix + "/legal", text.nav.legal]
  ];
  return <header className="site-header"><div className="site-shell">
    <div className="header-inner">
      <Brand locale={locale} />
      <nav className="nav-links" aria-label={locale === "ar" ? "التنقل الرئيسي" : "Main navigation"}>
        {links.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
      </nav>
      <div className="header-actions">
        <ThemeLocaleControls locale={locale} />
        <button className="menu-button" type="button" aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(value => !value)}>{open ? "×" : "☰"}</button>
      </div>
    </div>
    {open && <nav id="mobile-navigation" className="mobile-nav" aria-label={locale === "ar" ? "قائمة الهاتف" : "Mobile navigation"}>{links.map(([href, label]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>)}</nav>}
  </div></header>;
}

function SiteFooter({ locale, text }: { locale: Locale; text: Copy }) {
  const ar = locale === "ar";
  const prefix = "/" + locale;
  const groups = [
    { title: ar ? "المبادرة" : "Initiative", links: [["about", ar ? "عن غير معروف" : "About UNKNOWN"], ["categories", ar ? "التصنيفات" : "Categories"], ["latest", ar ? "أحدث المشاركات" : "Latest stories"], ["search", ar ? "البحث" : "Search stories"]] },
    { title: ar ? "القوانين والحقوق" : "Legal & rights", links: [["terms", ar ? "الشروط والأحكام" : "Terms of service"], ["privacy", ar ? "الخصوصية" : "Privacy"], ["disclaimer", ar ? "إخلاء المسؤولية" : "Disclaimer"], ["community", ar ? "قواعد المجتمع" : "Community rules"], ["legal", ar ? "مركز القوانين" : "Legal center"]] },
    { title: ar ? "المساعدة" : "Help", links: [["safety", ar ? "السلامة والمساعدة" : "Safety & support"], ["contact", ar ? "التواصل" : "Contact"], ["report", ar ? "الإبلاغ عن محتوى" : "Report content"], ["appeals", ar ? "الاعتراضات" : "Appeals"]] }
  ];
  return <footer className="site-footer"><div className="site-shell">
    <div className="footer-grid">
      <div><Brand locale={locale} /><p className="footer-summary">{text.footerLine}</p><p className="footer-summary">{text.footerDisclaimer}</p></div>
      {groups.map(group => <div key={group.title}><div className="footer-heading">{group.title}</div><div className="footer-links">{group.links.map(([path, label]) => <a key={path} href={prefix + "/" + path}>{label}</a>)}</div></div>)}
    </div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} UNKNOWN. {ar ? "جميع الحقوق محفوظة." : "All rights reserved."}</span><span>{ar ? "التعبير دون كشف الهوية العامة." : "Expression without a public identity."}</span></div>
  </div></footer>;
}

export function SiteShell({ locale, children }: { locale: Locale; children: ReactNode }) {
  const text = copy[locale];
  return <div lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
    <a className="skip-link" href="#main-content">{locale === "ar" ? "تجاوز إلى المحتوى" : "Skip to content"}</a>
    <SiteHeader locale={locale} text={text} />
    <main id="main-content" tabIndex={-1}>{children}</main>
    <SiteFooter locale={locale} text={text} />
  </div>;
}
