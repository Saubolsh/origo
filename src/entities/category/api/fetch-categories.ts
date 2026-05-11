import { cache } from "react";
import type { Category } from "../model";

export type ApiCategoryLocalizedText = {
  en: string | null;
  kk: string | null;
  ru: string | null;
};

export type ApiCategory = {
  id: number;
  name: { en: string; kk: string; ru: string };
  slug: string;
  description: ApiCategoryLocalizedText;
  parent_id?: number | null;
  preview: string;
  is_soon?: boolean;
  created_at: string;
  children?: ApiCategory[];
};

function apiNameLocale(locale: string): "en" | "kk" | "ru" {
  if (locale === "kz") return "kk";
  if (locale === "ru") return "ru";
  return "en";
}

function pickLocalizedName(
  names: ApiCategory["name"],
  locale: string
): string {
  const key = apiNameLocale(locale);
  return names[key] || names.en || names.ru || names.kk || "";
}

function pickLocalizedDescription(
  descriptions: ApiCategoryLocalizedText | undefined,
  locale: string
): string {
  if (!descriptions) return "";
  const key = apiNameLocale(locale);
  return (
    descriptions[key] ||
    descriptions.en ||
    descriptions.ru ||
    descriptions.kk ||
    ""
  );
}

function normalizeApiBase(): string {
  const raw =
    process.env.NEXT_PUBLIC_ORIGO_API_BASE?.trim() ?? "https://api.origo.kz";
  return raw.replace(/\/$/, "");
}

export const fetchCategoriesTreeJson = cache(
  async (): Promise<ApiCategory[]> => {
    const url = `${normalizeApiBase()}/api/v1/categories/tree`;
    const res = await fetch(url, {
      next: { revalidate: 60 },
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      throw new Error(
        `Failed to load categories tree (${res.status} ${res.statusText})`
      );
    }

    const data: unknown = await res.json();

    if (!Array.isArray(data)) {
      throw new Error("Categories tree API returned a non-array payload");
    }

    return data as ApiCategory[];
  }
);

export function mapApiCategoryToCategory(
  row: ApiCategory,
  locale: string,
  parentSlugs: string[] = []
): Category {
  const slugPath = [...parentSlugs, row.slug];
  const children = Array.isArray(row.children)
    ? [...row.children]
        .sort((a, b) => a.id - b.id)
        .map((child) => mapApiCategoryToCategory(child, locale, slugPath))
    : [];

  return {
    id: String(row.id),
    name: pickLocalizedName(row.name, locale),
    slug: row.slug,
    image: row.preview,
    description: pickLocalizedDescription(row.description, locale),
    slugPath,
    children,
  };
}

/**
 * Pre-render paths for `/categories/[slug]` — root categories only.
 * Child categories live under `/categories/[parentSlug]/[childSlug]`.
 */
export async function getCategorySlugStaticParams(): Promise<
  { slug: string }[]
> {
  try {
    const rows = await fetchCategoriesTreeJson();
    return [...rows]
      .sort((a, b) => a.id - b.id)
      .map((row) => ({ slug: row.slug }));
  } catch {
    return [];
  }
}

/**
 * Pre-render paths for `/categories/[parentSlug]/[childSlug]` —
 * every direct child of a root category.
 */
export async function getCategoryChildSlugStaticParams(): Promise<
  { parentSlug: string; childSlug: string }[]
> {
  try {
    const rows = await fetchCategoriesTreeJson();
    const pairs: { parentSlug: string; childSlug: string }[] = [];
    for (const root of [...rows].sort((a, b) => a.id - b.id)) {
      const children = Array.isArray(root.children) ? root.children : [];
      for (const child of [...children].sort((a, b) => a.id - b.id)) {
        pairs.push({ parentSlug: root.slug, childSlug: child.slug });
      }
    }
    return pairs;
  } catch {
    return [];
  }
}
