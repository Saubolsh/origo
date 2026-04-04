import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getCategories } from "@/entities/category/api";
import { getProducts } from "@/entities/product/api";
import { canonicalUrl } from "@/shared/lib/seo-url";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products] = await Promise.all([
    getCategories("en"),
    getProducts(),
  ]);

  const now = new Date();

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    entries.push({
      url: canonicalUrl(locale, "/"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    });

    entries.push({
      url: canonicalUrl(locale, "/products/"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    });

    entries.push({
      url: canonicalUrl(locale, "/categories/"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    });

    for (const category of categories) {
      entries.push({
        url: canonicalUrl(locale, `/categories/${category.slug}/`),
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }

    for (const product of products) {
      entries.push({
        url: canonicalUrl(locale, `/products/${product.slug}/`),
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  return entries;
}

