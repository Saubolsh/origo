import type { Category } from "../types";
import { categoriesData } from "./data";

export async function getCategories(): Promise<Category[]> {
  return categoriesData;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  return categoriesData.find((c) => c.slug === slug) ?? null;
}

export async function getCategoryById(id: string): Promise<Category | null> {
  return categoriesData.find((c) => c.id === id) ?? null;
}
