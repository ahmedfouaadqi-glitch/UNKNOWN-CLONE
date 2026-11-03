import { useCallback, useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";

type Step = { title: string; description: string; target?: string };
const steps: Record<Locale, Step[]> = {
  ar: [
    { title: "أهلاً بك في UNKNOWN", description: "جولة قصيرة للتعرف على مساحة التعبير المجهول. لا تحتاج إلى إنشاء حساب أو ملف شخصي." },
    { title: "التنقل في الموقع", description: "استخدم روابط الموقع للوصول إلى أحدث الحكايات والتصنيفات والبحث.", target: '[data-tour="navigation"]' },
    { title: "اكتب ما تريد مشاركته", description: "اكتب حكايتك واختر التصنيف، واقرأ الموافقات قبل الإرسال. قد يكون النشر العام معطلاً أو خاضعاً للمراجعة.", target: '[data-tour="write"]' },
    { title: "اكتشف حسب الشعور", description: "اختر تصنيفاً للعثور على حكايات مرتبطة به.", target: '[data-tour="categories"]' },
    { title: "اقرأ أحدث المشاركات", description: "تصفح المشاركات العامة واحترم خصوصية الآخرين عند الرد.", target: '[data-tour="latest"]' },
    { title: "أنت جاهز للبدء", description: "لا تكتب معلومات تكشف هويتك أو بيانات شخصية عن الآخرين. يمكنك تشغيل الجولة مجدداً." }
  ],
  en: [
    { title: "Welcome to UNKNOWN", description: "A short tour of this anonymous expression space. You do not need an account or public profile." },
    { title: "Navigate the site", description: "Use site links to find recent stories, categories and search.", target: '[data-tour="navigation"]' },
    { title: "Write what you want to share", description: "Write a story, choose a category, and review consent statements. Public publishing may be disabled or subject to review.", target: '[data-tour="write"]' },
    { title: "Explore by feeling", description: "Choose a category to find related stories.", target: '[data-tour="categories"]' },
    { title: "Read recent stories", description: "Browse public submissions and respect other people's privacy.", target: '[data-tour="latest"]' },
    { title: "You are ready to begin", description: "Do not include details that identify you or expose another person's private information. You can replay this tour." }
  ]
};
const seenKey = "unknown-intro-tour-seen-v1";
const requestKey = "unknown-intro-tour-requested-v1";

export function IntroTour({ locale }: { locale: Locale }) {
  const ar = locale === "ar";
  const tourSteps = steps[locale];
  const [active, setActive] = useState(false);
  const [index, setIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const clearHighlights = useCallback(() => {
    document.querySelectorAll(".intro-tour-highlight").forEach(node => node.classList.remove("intro-tour-highlight"));
    document.querySelectorAll(".intro-tour-header-highlight").forEach(node => node.classList.remove("intro-tour-header-highlight"));
  }, []);
  const close = useCallback((remember = true) => {
    setActive(false);
    clearHighlights();
    if (remember) { try { localStorage.setItem(seenKey, "1"); } catch { /* storage may be unavailable */ } }
  }, [clearHighlights]);
  const start = useCallback(() => {
    setIndex(0);
    setActive(true);
    try { sessionStorage.removeItem(requestKey); } catch { /* storage may be unavailable */ }
  }, []);

  useEffect(() => {
    setMounted(true);
    const pathname = window.location.pathname;
    if (pathname !== "/" + locale && pathname !== "/" + locale + "/") return;
    let requested = false;
    let seen = false;
    try { requested = sessionStorage.getItem(requestKey) === "1"; seen = localStorage.getItem(seenKey) === "1"; } catch { /* storage may be unavailable */ }
    if (requested || !seen) {
      const timer = window.setTimeout(start, requested ? 120 : 650);
      return () => window.clearTimeout(timer);
    }
  }, [locale, start]);

  useEffect(() => {
    if (!active) return;
    clearHighlights();
    const selector = tourSteps[index]?.target;
    if (selector) {
      const element = document.querySelector<HTMLElement>(selector);
      if (element) {
        element.classList.add("intro-tour-highlight");
        if (element.closest(".site-header")) element.closest(".site-header")?.classList.add("intro-tour-header-highlight");
        element.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "nearest", inline: "nearest" });
      }
    }
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") close(); };
    window.addEventListener("keydown", onKeyDown);
    return () => { window.removeEventListener("keydown", onKeyDown); clearHighlights(); };
  }, [active, clearHighlights, close, index, tourSteps]);

  function beginTour() {
    const pathname = window.location.pathname;
    if (pathname !== "/" + locale && pathname !== "/" + locale + "/") {
      try { sessionStorage.setItem(requestKey, "1"); } catch { /* storage may be unavailable */ }
      window.location.assign("/" + locale);
      return;
    }
    start();
  }

  if (!mounted) return null;
  return <>
    <button type="button" className="intro-tour-trigger" onClick={beginTour}><span aria-hidden="true">ⓘ</span>{ar ? "الجولة التعريفية" : "Quick tour"}</button>
    {active && <div className="intro-tour-layer">
      <button type="button" className="intro-tour-backdrop" aria-label={ar ? "إغلاق الجولة" : "Close tour"} onClick={() => close()} />
      <section className="intro-tour-dialog" role="dialog" aria-modal="true" aria-labelledby="intro-tour-title" dir={ar ? "rtl" : "ltr"}>
        <div className="intro-tour-topline"><span>{ar ? "دليل الاستخدام" : "QUICK GUIDE"}</span><span>{index + 1} / {tourSteps.length}</span></div>
        <div className="intro-tour-progress" aria-hidden="true"><span style={{ width: ((index + 1) / tourSteps.length * 100) + "%" }} /></div>
        <h2 id="intro-tour-title">{tourSteps[index].title}</h2>
        <p>{tourSteps[index].description}</p>
        <div className="intro-tour-actions">
          <button type="button" className="secondary-button" onClick={() => close()}>{ar ? "إنهاء الجولة" : "End tour"}</button>
          <div className="intro-tour-step-actions">
            <button type="button" className="secondary-button" disabled={index === 0} onClick={() => setIndex(value => Math.max(0, value - 1))}>{ar ? "السابق" : "Back"}</button>
            <button type="button" className="primary-button" onClick={() => index === tourSteps.length - 1 ? close() : setIndex(value => Math.min(tourSteps.length - 1, value + 1))}>{index === tourSteps.length - 1 ? (ar ? "ابدأ الاستكشاف" : "Start exploring") : (ar ? "التالي" : "Next")}</button>
          </div>
        </div>
      </section>
    </div>}
  </>;
}
