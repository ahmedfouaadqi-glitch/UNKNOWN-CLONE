import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: LocaleChooser });

function LocaleChooser() {
  useEffect(() => {
    const locale = navigator.language.toLowerCase().startsWith("ar") ? "ar" : "en";
    window.location.replace("/" + locale);
  }, []);

  return (
    <main className="site-shell locale-chooser">
      <div className="locale-card">
        <p className="eyebrow">UNKNOWN · غير معروف</p>
        <h1>Choose your language</h1>
        <p>اختر لغتك</p>
        <div className="locale-options">
          <a className="primary-button" href="/ar" lang="ar" dir="rtl">العربية</a>
          <a className="secondary-button" href="/en">English</a>
        </div>
      </div>
    </main>
  );
}
