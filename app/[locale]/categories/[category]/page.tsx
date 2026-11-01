import { notFound } from "next/navigation";
import { isLocale, copy } from "@/lib/i18n";
import { categoryLabel, categories } from "@/lib/categories";
import { getPostsPage } from "@/lib/content";
import { PostCard } from "@/components/post-card";
import { Pagination } from "@/components/pagination";

export default async function Page({ params, searchParams }: {
  params: Promise<{ locale: string; category: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { locale, category } = await params;
  if (!isLocale(locale) || !categories.some(item => item.id === category)) notFound();
  const query = await searchParams;
  const rawPage = Array.isArray(query.page) ? query.page[0] : query.page;
  const parsedPage = Number.parseInt(rawPage || "1", 10);
  const page = Number.isFinite(parsedPage) ? Math.min(Math.max(parsedPage, 1), 1000) : 1;
  const result = await getPostsPage({ page, pageSize: 12, category });
  const ar = locale === "ar";
  const t = copy[locale];
  return (
    <div className="site-shell">
      <header className="page-intro">
        <span className="eyebrow">{ar ? "التصنيف" : "Category"}</span>
        <h1 className="page-title">{categoryLabel(category, locale)}</h1>
        <p className="section-description">{ar ? "حكايات منشورة ضمن هذا الشعور." : "Stories shared in this category."}</p>
      </header>
      {result.posts.length
        ? <div className="post-list" style={{ paddingBottom: 24 }}>{result.posts.map(post => <PostCard key={post.id} post={post} locale={locale}/>)}</div>
        : <div className="empty-state" style={{ marginBottom: 24 }}><strong>{t.noStories}</strong>{t.emptyText}</div>}
      <Pagination locale={locale} page={result.page} totalPages={result.totalPages} basePath={"/" + locale + "/categories/" + category}/>
    </div>
  );
}
