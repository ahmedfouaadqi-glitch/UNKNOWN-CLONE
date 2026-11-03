import { createFileRoute } from "@tanstack/react-router";
import { getPublicSiteOrigin } from "@/lib/site-url.mjs";

const publicPaths = [
  "",
  "/about",
  "/categories",
  "/latest",
  "/terms",
  "/privacy",
  "/disclaimer",
  "/community",
  "/legal",
  "/contact",
  "/safety",
  "/report"
];

export const Route = createFileRoute("/sitemap[.]xml")({
  server: {
    handlers: {
      GET: () => {
        const base = getPublicSiteOrigin();
        
        const urls = ["ar", "en"].flatMap((locale) =>
          publicPaths.map((path) => {
            const priority = path === "" ? "1.0" : "0.5";
            return `<url><loc>${base}/${locale}${path}</loc><changefreq>weekly</changefreq><priority>${priority}</priority></url>`;
          })
        );
        const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
        return new Response(body, {
          headers: {
            "content-type": "application/xml; charset=utf-8",
            "cache-control": "public, max-age=3600"
          }
        });
      }
    }
  }
});
