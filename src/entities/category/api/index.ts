import type { Category } from "../model";
import {
  fetchCategoriesTreeJson,
  mapApiCategoryToCategory,
} from "./fetch-categories";

export {
  getCategorySlugStaticParams,
  getCategoryChildSlugStaticParams,
} from "./fetch-categories";

function* flattenCategories(
  categories: Category[]
): Generator<Category, void, void> {
  for (const category of categories) {
    yield category;
    if (category.children.length > 0) {
      yield* flattenCategories(category.children);
    }
  }
}

export async function getCategories(locale: string): Promise<Category[]> {
  const rows = await fetchCategoriesTreeJson();
  return [...rows]
    .sort((a, b) => a.id - b.id)
    .map((row) => mapApiCategoryToCategory(row, locale));
}

export async function getCategoryBySlug(
  slug: string,
  locale: string
): Promise<Category | null> {
  const categories = await getCategories(locale);
  for (const category of flattenCategories(categories)) {
    if (category.slug === slug) return category;
  }
  return null;
}

export async function getCategoryById(
  id: string,
  locale: string
): Promise<Category | null> {
  const categories = await getCategories(locale);
  for (const category of flattenCategories(categories)) {
    if (category.id === id) return category;
  }
  return null;
}

export async function getCategoryBySlugPath(
  path: string[],
  locale: string
): Promise<Category | null> {
  if (path.length === 0) return null;
  const categories = await getCategories(locale);
  for (const category of flattenCategories(categories)) {
    if (
      category.slugPath.length === path.length &&
      category.slugPath.every((segment, idx) => segment === path[idx])
    ) {
      return category;
    }
  }
  return null;
}
