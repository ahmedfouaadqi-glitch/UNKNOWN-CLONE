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
  features: PageFeatures;
  targetType?: "post" | "comment";
  targetId?: string;
};

export function ContentPageWithInteractions(props: ContentPageProps) {
  const { locale, path, post, features, targetType = "post", targetId = "" } = props;
  const parts = path.split("/").filter(Boolean);
  const isStory = parts[0] === "p" && Boolean(post);
  const isReport = parts[0] === "report";
  const text = copy[locale];

  return <>
    <ContentPage {...props} />
    {isStory && post && <div className="site-shell" style={{ maxWidth: 880 }}>
      <Reactions postId={post.id} locale={locale} enabled={features.publishingReady} />
      <div className="comment-tools">
        <a className="report-link" href={`/${locale}/report?targetType=post&targetId=${post.id}`}>
          {locale === "ar" ? "الإبلاغ عن المشاركة" : "Report story"}
        </a>
        <DeleteContent locale={locale} type="post" id={post.id} enabled={features.storageReady} />
      </div>
      <Comments
        postId={post.id}
        locale={locale}
        text={text}
        enabled={features.publishingReady}
        storageReady={features.storageReady}
      />
    </div>}
    {isReport && <div className="site-shell inner-page" style={{ paddingTop: 0 }}>
      <ReportForm
        locale={locale}
        initialTargetType={targetType}
        initialTargetId={targetId}
        enabled={features.storageReady}
      />
    </div>}
  </>;
}
