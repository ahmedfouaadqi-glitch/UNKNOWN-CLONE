import { createFileRoute } from "@tanstack/react-router";
import { AdminPanel } from "@/src/components/admin/admin-panel";
import styles from "@/src/components/admin/admin-panel.module.css";

export const Route = createFileRoute("/admin")({
  validateSearch: (search: Record<string, unknown>) => ({
    auth: typeof search.auth === "string" ? search.auth : undefined
  }),
  head: () => ({
    meta: [
      { title: "إدارة UNKNOWN" },
      { name: "robots", content: "noindex, nofollow, noarchive, nosnippet" },
      { name: "referrer", content: "no-referrer" }
    ]
  }),
  component: AdminPage
});

function AdminPage() {
  const { auth } = Route.useSearch();
  return <div className={styles.page} dir="rtl" lang="ar"><AdminPanel authCode={auth} /></div>;
}
