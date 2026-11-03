import { createFileRoute } from "@tanstack/react-router";
import { AdminPanel } from "@/src/components/admin/admin-panel";

export const Route = createFileRoute("/admin")({
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
  const search = typeof window === "undefined" ? "" : window.location.search;
  const authCode = new URLSearchParams(search).get("auth") || undefined;
  return <div className="admin-page" dir="rtl" lang="ar"><AdminPanel authCode={authCode} /></div>;
}
