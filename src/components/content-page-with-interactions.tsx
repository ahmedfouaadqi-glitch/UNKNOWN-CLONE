import type { Locale } from "@/lib/i18n";
import type { PublicPost, PostsPageResult } from "@/lib/content";
import { copy } from "@/lib/i18n";
import { ContentPage } from "@/src/components/pages";
import { Comments, DeleteContent, Reactions, ReportForm } from "@/src/components/interactions";

type PageFeatures = { storageReady: boolean; publishingReady: boolean };

export type ContentPageProps = {
  locale: Locale;
  path: string;
  posts: PostsPageResult | null;
  post: PublicPost | null;
  query: string;
  category?: string;
  invalidCategory?: boolean;
  features: PageFeatures;
  targetType?: "post" | "comment";
  targetId?: string;
};

function Pagination({ locale, path, query, result }: { locale: Locale; path: string; query: string; result: PostsPageResult }) {
  if (result.totalPages < 2) return null;
  const basePath = "/" + locale + "/" + path;
  function href(page: number) {
    const params = new URLSearchParams();
    params.set("page", String(page));
    if (query) params.set("q", query);
    return basePath + "?" + params.toString();
  }
  const ar = locale === "ar";
  return <nav className="pagination" aria-label={ar ? "التنقل بين الصفحات" : "Pagination"}>
    {result.page > 1
      ? <a className="secondary-button" href={href(result.page - 1)} rel="prev">{ar ? "السابق" : "Previous"}</a>
      : <span className="secondary-button pagination-disabled" aria-disabled="true">{ar ? "السابق" : "Previous"}</span>}
    <span className="pagination-status">{ar ? "صفحة " + result.page + " من " + result.totalPages : "Page " + result.page + " of " + result.totalPages}</span>
    {result.page < result.totalPages
      ? <a className="secondary-button" href={href(result.page + 1)} rel="next">{ar ? "التالي" : "Next"}</a>
      : <span className="secondary-button pagination-disabled" aria-disabled="true">{ar ? "التالي" : "Next"}</span>}
  </nav>;
}

export function ContentPageWithInteractions(props: ContentPageProps) {
  const { locale, path, posts, query, post, features, targetType = "post", targetId = "" } = props;
  const parts = path.split("/").filter(Boolean);
  const isStory = parts[0] === "p" && Boolean(post);
  const isReport = parts[0] === "report";
  const text = copy[locale];

  return <>
    <ContentPage {...props} />
    {posts && <div className="site-shell" style={{ paddingBottom: 32 }}>
      <Pagination locale={locale} path={path} query={query} result={posts} />
    </div>}
    {isStory && post && <div className="site-shell" style={{ maxWidth: 880 }}>
      <Reactions postId={post.id} locale={locale} enabled={features.publishingReady} />
      <div className="comment-tools">
        <a className="report-link" href={`/${locale}/report?targetType=post&targetId=${post.id}`}>
          {locale === "ar" ? "الإبلاغ عن المشاركة" : "Report story"}
        </a>
        <DeleteContent locale={locale} type="post" id={post.id} enabled={features.storageReady} />
      </div>
      <Comments postId={post.id} locale={locale} text={text} enabled={features.publishingReady} storageReady={features.storageReady} />
    </div>}
    {isReport && <div className="site-shell inner-page" style={{ paddingTop: 0 }}>
      <ReportForm locale={locale} initialTargetType={targetType} initialTargetId={targetId} enabled={features.storageReady} />
    </div>}
  </>;
}
