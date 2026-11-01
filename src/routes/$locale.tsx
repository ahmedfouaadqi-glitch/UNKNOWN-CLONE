import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";
import { isLocale } from "@/lib/i18n";
import { SiteShell } from "@/src/components/site-shell";

export const Route = createFileRoute("/$locale")({
  beforeLoad: ({ params }) => {
    if (!isLocale(params.locale)) throw notFound();
  },
  component: LocaleLayout
});

function LocaleLayout() {
  const { locale } = Route.useParams();
  if (!isLocale(locale)) return null;
  return <SiteShell locale={locale}><Outlet /></SiteShell>;
}
