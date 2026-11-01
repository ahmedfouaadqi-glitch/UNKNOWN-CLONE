import Link from "next/link";
import type { Locale } from "@/lib/i18n";

export function Pagination({ locale, page, totalPages, basePath, query, category }: {
  locale: Locale;
  page: number;
  totalPages: number;
  basePath: string;
  query?: string;
  category?: string;
}) {
  if (totalPages < 2) return null;
  const ar = locale === "ar";
  const href = (nextPage: number) => {
    const params = new URLSearchParams();
    params.set("page", String(nextPage));
    if (query) params.set("q", query);
    if (category) params.set("category", category);
    return basePath + "?" + params.toString();
  };
  return (
    <nav className="pagination" aria-label={ar ? "التنقل بين الصفحات" : "Pagination"}>
      {page > 1
        ? <Link className="secondary-button" href={href(page - 1)} rel="prev">{ar ? "السابق" : "Previous"}</Link>
        : <span className="secondary-button pagination-disabled" aria-disabled="true">{ar ? "السابق" : "Previous"}</span>}
      <span className="pagination-status">{ar ? "صفحة " + page + " من " + totalPages : "Page " + page + " of " + totalPages}</span>
      {page < totalPages
        ? <Link className="secondary-button" href={href(page + 1)} rel="next">{ar ? "التالي" : "Next"}</Link>
        : <span className="secondary-button pagination-disabled" aria-disabled="true">{ar ? "التالي" : "Next"}</span>}
    </nav>
  );
}
