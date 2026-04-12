import type { Category } from "../model";
import {
  fetchCategoriesJson,
  mapApiCategoryToCategory,
} from "./fetch-categories";

export { getCategorySlugStaticParams } from "./fetch-categories";

export async function getCategories(locale: string): Promise<Category[]> {
  const rows = await fetchCategoriesJson();
  const sorted = [...rows].sort((a, b) => a.id - b.id);
  return sorted.map((row) => mapApiCategoryToCategory(row, locale));
}

export async function getCategoryBySlug(
  slug: string,
  locale: string
): Promise<Category | null> {
  const categories = await getCategories(locale);
  return categories.find((c) => c.slug === slug) ?? null;
}

export async function getCategoryById(
  id: string,
  locale: string
): Promise<Category | null> {
  const categories = await getCategories(locale);
  return categories.find((c) => c.id === id) ?? null;
}
