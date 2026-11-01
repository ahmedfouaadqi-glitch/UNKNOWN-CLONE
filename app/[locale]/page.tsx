import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { isLocale, copy, type Locale } from "@/lib/i18n";
import { getCountryCode, getCountryName } from "@/lib/countries";
import { getLatestPosts } from "@/lib/content";
import { categories } from "@/lib/content";
import { HeroArt } from "@/components/hero-art";
import { PublishForm } from "@/components/publish-form";
import { PostCard } from "@/components/post-card";
import { CategoryGrid } from "@/components/category-grid";
import { SoftReveal } from "@/components/soft-reveal";

export const dynamic = "force-dynamic";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const t = copy[locale];
  const h = await headers();
  const country = getCountryName(getCountryCode(h), locale);
  const posts = await getLatestPosts(6);
  const ar = locale === "ar";
  return (
    <div className="site-shell">
      <section className="hero">
        <div className="reveal">
          <span className="eyebrow">{t.heroEyebrow}</span>
          <h1 className="hero-title">{t.heroTitleA} <em>{t.heroTitleB}</em></h1>
          <p className="hero-copy">{t.heroCopy}</p>
          <div className="country-note"><span aria-hidden="true">◎</span>{t.countryPrefix} <strong>{country}</strong><span aria-hidden="true">·</span>{t.countryNotice}</div>
        </div>
        <div className="hero-art"><HeroArt /></div>
      </section>

      <section id="write" className="section" style={{ borderTop: 0, paddingTop: 10 }}>
        <div className="section-heading"><div><h2 className="section-title">{t.writeTitle}</h2><p className="section-description">{ar ? "لا تحتاج إلى اسم كي تكتب حكايتك." : "You do not need a name to tell your story."}</p></div><span className="writer-note">{ar ? "مساحة مفتوحة للكلمات" : "A quiet space for words"}</span></div>
        <PublishForm locale={locale} copy={t} />
      </section>

      <section className="section">
        <div className="section-heading"><div><h2 className="section-title">{t.categoriesTitle}</h2><p className="section-description">{t.categoriesDescription}</p></div><Link className="text-link" href={`/${locale}/categories`}>{t.viewAll} ↗</Link></div>
        <CategoryGrid locale={locale} />
      </section>

      <section className="section">
        <div className="section-heading"><div><h2 className="section-title">{t.latestTitle}</h2><p className="section-description">{t.latestDescription}</p></div><Link className="text-link" href={`/${locale}/latest`}>{t.viewAll} ↗</Link></div>
        {posts.length > 0 ? <div className="post-list">{posts.map((post) => <SoftReveal key={post.id}><PostCard post={post} locale={locale} /></SoftReveal>)}</div> : <div className="empty-state"><strong>{t.emptyTitle}</strong>{t.emptyText}<p className="writer-note">{ar ? "لن تظهر أي مشاركات تجريبية أو قصص مختلقة." : "No fabricated or demo stories are shown."}</p></div>}
      </section>

      <section className="section">
        <div className="section-heading"><div><h2 className="section-title">{ar ? "مساحة إنسانية، لا ملف شخصي" : "A human space, not a profile"}</h2><p className="section-description">{ar ? "لا متابعين ولا سباق شعبية. فقط كلمات وتجارب ومشاعر." : "No followers or popularity contest. Just words, experiences and feelings."}</p></div></div>
        <div className="country-grid">
          {[{symbol:"✎",ar:"اكتب بحرية",en:"Write freely",descAr:"شارك ما بداخلك دون إنشاء حساب.",descEn:"Express yourself without creating an account."},{symbol:"♡",ar:"استمع بتعاطف",en:"Respond with care",descAr:"تعليقات مجهولة تحترم الآخرين.",descEn:"Anonymous responses that respect others."},{symbol:"⌑",ar:"احمِ الخصوصية",en:"Respect privacy",descAr:"لا تكشف بياناتك أو أسرار غيرك.",descEn:"Protect your details and other people's privacy."}].map((item) => <div className="country-card" key={item.symbol}><div className="category-symbol">{item.symbol}</div><h3 className="post-title" style={{ marginTop: 16 }}>{ar ? item.ar : item.en}</h3><p className="section-description">{ar ? item.descAr : item.descEn}</p></div>)}
        </div>
      </section>
    </div>
  );
}
