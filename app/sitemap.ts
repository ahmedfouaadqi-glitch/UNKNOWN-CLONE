import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
  const routes = ["ar","en"].flatMap((locale) => ["","/about","/categories","/latest","/terms","/privacy","/disclaimer","/community","/legal","/contact","/safety","/report"].map((path) => ({ url: `${base}/${locale}${path}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: path === "" ? 1 : .5 })));
  return routes;
}
