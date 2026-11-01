import Link from "next/link";
import { Brand } from "@/components/brand";
import type { Locale, Copy } from "@/lib/i18n";

export function SiteFooter({ locale, copy }: { locale: Locale; copy: Copy }) {
  const p = `/${locale}`;
  const isAr = locale === "ar";
  return (
    <footer className="site-footer">
      <div className="site-shell">
        <div className="footer-grid">
          <div>
            <Brand locale={locale} />
            <p className="footer-summary">{copy.footerLine} {isAr ? "مساحة عالمية للتعبير الكتابي دون حسابات أو ملفات شخصية." : "A global space for written expression without accounts or public profiles."}</p>
            <p className="footer-summary">{copy.footerDisclaimer}</p>
          </div>
          <div><div className="footer-heading">{isAr ? "المبادرة" : "Initiative"}</div><div className="footer-links">
            <Link href={`${p}/about`}>{isAr ? "عن غير معروف" : "About UNKNOWN"}</Link>
            <Link href={`${p}/categories`}>{isAr ? "التصنيفات" : "Categories"}</Link>
            <Link href={`${p}/latest`}>{isAr ? "أحدث المشاركات" : "Latest stories"}</Link>
            <Link href={`${p}/search`}>{isAr ? "البحث" : "Search stories"}</Link>
          </div></div>
          <div><div className="footer-heading">{isAr ? "القوانين والحقوق" : "Legal & rights"}</div><div className="footer-links">
            <Link href={`${p}/terms`}>{isAr ? "الشروط والأحكام" : "Terms of service"}</Link>
            <Link href={`${p}/privacy`}>{isAr ? "الخصوصية" : "Privacy"}</Link>
            <Link href={`${p}/disclaimer`}>{isAr ? "إخلاء المسؤولية" : "Disclaimer"}</Link>
            <Link href={`${p}/community`}>{isAr ? "قواعد المجتمع" : "Community rules"}</Link>
            <Link href={`${p}/legal`}>{isAr ? "مركز القوانين" : "Legal center"}</Link>
          </div></div>
          <div><div className="footer-heading">{isAr ? "المساعدة" : "Help"}</div><div className="footer-links">
            <Link href={`${p}/safety`}>{isAr ? "السلامة والمساعدة" : "Safety & support"}</Link>
            <Link href={`${p}/contact`}>{isAr ? "التواصل والبلاغات" : "Contact & reports"}</Link>
            <Link href={`${p}/report`}>{isAr ? "الإبلاغ عن محتوى" : "Report content"}</Link>
          </div></div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} UNKNOWN. {isAr ? "جميع الحقوق محفوظة." : "All rights reserved."}</span>
          <span>{isAr ? "التعبير دون كشف الهوية العامة." : "Expression without a public identity."}</span>
        </div>
      </div>
    </footer>
  );
}
