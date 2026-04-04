import type { MetadataRoute } from "next";
import { sitemapUrl } from "@/shared/lib/seo-url";

export const revalidate = 86400;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: sitemapUrl(),
  };
}

