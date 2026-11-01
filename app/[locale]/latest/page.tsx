import { notFound } from "next/navigation";
import { isLocale, copy } from "@/lib/i18n";
import { getPostsPage } from "@/lib/content";
import { PostCard } from "@/components/post-card";
import { Pagination } from "@/components/pagination";

export default async function Page({ params, searchParams }: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const paramsValue = await searchParams;
  const rawPage = Array.isArray(paramsValue.page) ? paramsValue.page[0] : paramsValue.page;
  const parsedPage = Number.parseInt(rawPage || "1", 10);
  const page = Number.isFinite(parsedPage) ? Math.min(Math.max(parsedPage, 1), 1000) : 1;
  const result = await getPostsPage({ page, pageSize: 12 });
  const t = copy[locale];
  const ar = locale === "ar";
  return (
    <div className="site-shell">
      <header className="page-intro">
        <span className="eyebrow">{ar ? "حكايات المجتمع" : "Community stories"}</span>
        <h1 className="page-title">{t.latestTitle}</h1>
        <p className="section-description">{t.latestDescription}</p>
      </header>
      {result.posts.length
        ? <div className="post-list" style={{ paddingBottom: 24 }}>{result.posts.map(post => <PostCard key={post.id} post={post} locale={locale}/>)}</div>
        : <div className="empty-state" style={{ marginBottom: 24 }}><strong>{t.emptyTitle}</strong>{t.emptyText}</div>}
      <Pagination locale={locale} page={result.page} totalPages={result.totalPages} basePath={"/" + locale + "/latest"}/>
    </div>
  );
}
