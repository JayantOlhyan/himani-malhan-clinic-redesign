import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/site";
import { categories, detailedServices } from "@/content/services";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/about/",
    "/expertise/",
    ...categories.map((c) => `/expertise/${c.slug}/`),
    ...detailedServices.map((s) => `/services/${s.slug}/`),
    "/clinics/",
    "/resources/",
    "/book/",
  ];
  return paths.map((p) => ({ url: `${SITE_URL}${p}`, changeFrequency: "monthly", priority: p === "/" ? 1 : 0.7 }));
}
