import { createFileRoute } from "@tanstack/react-router";

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
        const base = (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://unknown-ey4evzj9.manus.space").replace(/\/+$/, "");
        const lastModified = new Date().toISOString();
        const urls = ["ar", "en"].flatMap((locale) =>
          publicPaths.map((path) => {
            const priority = path === "" ? "1.0" : "0.5";
            return `<url><loc>${base}/${locale}${path}</loc><lastmod>${lastModified}</lastmod><changefreq>weekly</changefreq><priority>${priority}</priority></url>`;
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
