import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { ReportForm } from "@/components/report-form";
export default async function Page({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ targetType?: string; targetId?: string }> }) {
  const { locale } = await params; if (!isLocale(locale)) notFound();
  const query = await searchParams;
  const initialTargetType = query.targetType === "comment" ? "comment" : "post";
  const initialTargetId = typeof query.targetId === "string" && /^[0-9a-f-]{36}$/i.test(query.targetId) ? query.targetId : "";
  const ar = locale === "ar";
  return <div className="site-shell"><header className="page-intro"><span className="eyebrow">{ar ? "السلامة والحقوق" : "Safety & rights"}</span><h1 className="page-title">{ar ? "الإبلاغ عن محتوى" : "Report content"}</h1><p className="section-description">{ar ? "يساعدنا البلاغ المحدد على فهم المشكلة دون جمع معلومات شخصية غير ضرورية." : "A specific report helps identify a problem without collecting unnecessary personal information."}</p></header><div style={{ maxWidth: 760, paddingBottom: 70 }}><ReportForm locale={locale} initialTargetType={initialTargetType} initialTargetId={initialTargetId}/></div></div>;
}
