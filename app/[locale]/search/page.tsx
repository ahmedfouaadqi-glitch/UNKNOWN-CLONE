import { notFound } from "next/navigation";
import { isLocale, copy } from "@/lib/i18n";
import { getPostsPage } from "@/lib/content";
import { PostCard } from "@/components/post-card";
import { Pagination } from "@/components/pagination";
import { categories } from "@/lib/categories";
import type { Metadata } from "next";

export const metadata: Metadata = { robots: { index: false, follow: true } };

export default async function SearchPage({ params, searchParams }: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const search = await searchParams;
  const rawQuery = Array.isArray(search.q) ? search.q[0] || "" : search.q || "";
  const query = rawQuery.trim().replace(/\s+/gu, " ");
  const rawCategory = Array.isArray(search.category) ? search.category[0] || "" : search.category || "";
  const category = categories.some(item => item.id === rawCategory) ? rawCategory : "";
  const invalidCategory = Boolean(rawCategory && !category);
  const rawPage = Array.isArray(search.page) ? search.page[0] : search.page;
  const pageNumber = Number.parseInt(rawPage || "1", 10);
  const page = Number.isFinite(pageNumber) ? Math.min(Math.max(pageNumber, 1), 1000) : 1;
  const ar = locale === "ar";
  const t = copy[locale];
  const result = query.length >= 2 || (category && !query)
    ? await getPostsPage({ query, category: category || undefined, page, pageSize: 12 })
    : { posts: [], total: 0, page, pageSize: 12, totalPages: 0, invalidQuery: false };
  const invalid = Boolean(result.invalidQuery) || invalidCategory || (query.length > 0 && query.length < 2);

  return (
    <div className="site-shell">
      <header className="page-intro">
        <span className="eyebrow">{ar ? "البحث في الحكايات" : "Explore stories"}</span>
        <h1 className="page-title">{ar ? "ابحث عن كلمة أو حكاية" : "Search stories"}</h1>
        <p className="section-description">{ar ? "ابحث في عناوين المشاركات ونصوصها المنشورة." : "Search published story titles and text."}</p>
      </header>
      <form className="search-form" action={"/" + locale + "/search"} method="get" role="search">
        <label className="sr-only" htmlFor="story-search">{ar ? "عبارة البحث" : "Search phrase"}</label>
        <input id="story-search" className="text-input" type="search" name="q" minLength={2} maxLength={80} defaultValue={query} placeholder={ar ? "اكتب كلمة للبحث..." : "Enter a search phrase…"} />
        <label className="sr-only" htmlFor="story-category">{ar ? "تصفية حسب التصنيف" : "Filter by category"}</label>
        <select id="story-category" className="select-input search-category" name="category" defaultValue={category}>
          <option value="">{ar ? "كل التصنيفات" : "All categories"}</option>
          {categories.map(item => <option key={item.id} value={item.id}>{item[locale]}</option>)}
        </select>
        <button className="primary-button" type="submit">{ar ? "بحث" : "Search"}</button>
      </form>
      {invalid
        ? <div className="empty-state">{ar ? "استخدم حرفين على الأقل، ومن دون رموز خاصة." : "Use at least two letters or numbers; special symbols are not supported."}</div>
        : query.length >= 2 || category
          ? <section className="section">
              <p className="search-results-meta">{ar ? "النتائج: " + result.total : result.total + " results"}</p>
              {result.posts.length
                ? <div className="post-list">{result.posts.map(post => <PostCard key={post.id} post={post} locale={locale}/>)}</div>
                : <div className="empty-state">{t.noStories}</div>}
              <Pagination locale={locale} page={result.page} totalPages={result.totalPages} basePath={"/" + locale + "/search"} query={query} category={category}/>
            </section>
          : <div className="empty-state">{ar ? "أدخل حرفين على الأقل أو اختر تصنيفاً لعرض المشاركات." : "Enter at least two characters or choose a category to browse stories."}</div>}
    </div>
  );
}
