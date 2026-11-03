import { createFileRoute } from "@tanstack/react-router";
import { getPublicSiteOrigin } from "@/lib/site-url.mjs";

export const Route = createFileRoute("/robots[.]txt")({
  server: {
    handlers: {
      GET: () => {
        const base = getPublicSiteOrigin();
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
