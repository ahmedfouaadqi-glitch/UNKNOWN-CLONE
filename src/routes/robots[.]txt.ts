import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/robots[.]txt")({
  server: {
    handlers: {
      GET: () => {
        const base = (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://unknown-ey4evzj9.manus.space").replace(/\/+$/, "");
        const body = [
          "User-agent: *",
          "Allow: /ar",
          "Allow: /en",
          "Disallow: /api/",
          "Disallow: /admin",
          `Sitemap: ${base}/sitemap.xml`,
          ""
        ].join("\n");
        return new Response(body, {
          headers: {
            "content-type": "text/plain; charset=utf-8",
            "cache-control": "public, max-age=3600"
          }
        });
      }
    }
  }
});
