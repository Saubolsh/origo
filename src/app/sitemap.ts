import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getCategories } from "@/entities/category";
import { getProducts } from "@/entities/product";
import { canonicalUrl } from "@/shared/lib/seo-url";
import type { Category } from "@/shared/model";

export const revalidate = 3600;

function collectCategoryPaths(categories: Category[]): string[][] {
  const paths: string[][] = [];
  for (const category of categories) {
    paths.push(category.slugPath);
    if (category.children.length > 0) {
      paths.push(...collectCategoryPaths(category.children));
    }
  }
  return paths;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products] = await Promise.all([
    getCategories("en"),
    getProducts(),
  ]);

  const now = new Date();
  const categoryPaths = collectCategoryPaths(categories);

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

    for (const slugPath of categoryPaths) {
      entries.push({
        url: canonicalUrl(locale, `/categories/${slugPath.join("/")}/`),
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
