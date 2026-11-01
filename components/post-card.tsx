import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import type { PublicPost } from "@/lib/content";
import { categoryLabel } from "@/lib/content";

export function PostCard({ post, locale }: { post: PublicPost; locale: Locale }) {
  const isAr = locale === "ar";
  const date = new Intl.DateTimeFormat(locale === "ar" ? "ar" : "en", { dateStyle: "medium" }).format(new Date(post.published_at));
  return (
    <article className="post-card">
      <div className="post-meta"><span className="post-category">{categoryLabel(post.category, locale)}</span><time dateTime={post.published_at}>{date}</time></div>
      <Link href={`/${locale}/p/${post.id}`}><h3 className="post-title">{post.title || (isAr ? "مشاركة دون عنوان" : "Untitled story")}</h3></Link>
      <p className="post-body">{post.body.length > 270 ? post.body.slice(0, 270) + "…" : post.body}</p>
      <div className="post-actions"><Link className="text-link" href={`/${locale}/p/${post.id}`}>{isAr ? "اقرأ الحكاية ←" : "Read story →"}</Link></div>
    </article>
  );
}
