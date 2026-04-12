import { cache } from "react";
import type { Category } from "../model";

export type ApiCategory = {
  id: number;
  name: { en: string; kk: string; ru: string };
  slug: string;
  preview: string;
  created_at: string;
};

function apiNameLocale(locale: string): keyof ApiCategory["name"] {
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

function normalizeApiBase(): string {
  const raw =
    process.env.NEXT_PUBLIC_ORIGO_API_BASE?.trim() ?? "https://api.origo.kz";
  return raw.replace(/\/$/, "");
}

export const fetchCategoriesJson = cache(async (): Promise<ApiCategory[]> => {
  const url = `${normalizeApiBase()}/api/v1/categories`;
  const res = await fetch(url, {
    next: { revalidate: 60 },
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(
      `Failed to load categories (${res.status} ${res.statusText})`
    );
  }

  const data: unknown = await res.json();

  if (!Array.isArray(data)) {
    throw new Error("Categories API returned a non-array payload");
  }

  return data as ApiCategory[];
});

/** Pre-render paths: each `slug` is taken verbatim from the API response body. */
export async function getCategorySlugStaticParams(): Promise<
  { slug: string }[]
> {
  const rows = await fetchCategoriesJson();
  return [...rows]
    .sort((a, b) => a.id - b.id)
    .map((row) => ({ slug: row.slug }));
}

export function mapApiCategoryToCategory(
  row: ApiCategory,
  locale: string
): Category {
  return {
    id: String(row.id),
    name: pickLocalizedName(row.name, locale),
    slug: row.slug,
    image: row.preview,
    description: "",
  };
}
