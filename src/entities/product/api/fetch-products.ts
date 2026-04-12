import type { Product, Availability } from "../model";

/** Localized API fields (nullable per locale). */
export interface ApiLocaleStrings {
  en: string | null;
  kk: string | null;
  ru: string | null;
}

export interface ApiProductAttribute {
  id: number;
  name: { en: string; kk: string; ru: string };
  slug: string;
  type: string;
  unit: string | null;
  sort_order: number;
  value: string;
}

export interface ApiProduct {
  id: number;
  name: { en: string; kk: string; ru: string };
  slug: string;
  description: ApiLocaleStrings | string | null;
  price: { kzt: number; rub: number; usd: number };
  stock: number;
  category_id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  brand_name: { en: string; kk: string; ru: string } | string | null;
  sku: string;
  brand_id: number;
  content: ApiLocaleStrings | string | null;
  old_price: { kzt: number; rub: number; usd: number } | null;
  file_name: string;
  images: string[];
  is_soon?: boolean;
  attributes?: ApiProductAttribute[];
}

export interface ApiProductsResponse {
  page: number;
  page_size: number;
  products: ApiProduct[];
  total: number;
}

function normalizeApiBase(): string {
  const raw =
    process.env.NEXT_PUBLIC_ORIGO_API_BASE?.trim() ?? "https://api.origo.kz";
  return raw.replace(/\/$/, "");
}

function localeToCurrency(locale: string): {
  key: keyof ApiProduct["price"];
  code: string;
} {
  if (locale === "kz" || locale === "kk") return { key: "kzt", code: "KZT" };
  if (locale === "ru") return { key: "rub", code: "RUB" };
  return { key: "usd", code: "USD" };
}

function localeToNameKey(locale: string): keyof ApiProduct["name"] {
  if (locale === "kz") return "kk";
  if (locale === "ru") return "ru";
  return "en";
}

function categoryToProductType(categoryId: number): Product["productType"] {
  switch (categoryId) {
    case 1:
      return "engineering-model";
    case 2:
      return "collectible-figure";
    default:
      return "collectible-figure";
  }
}

function pickBrand(
  brandName: ApiProduct["brand_name"],
  nameKey: keyof ApiProduct["name"],
): string {
  if (!brandName) return "";
  if (typeof brandName === "string") return brandName;
  return brandName[nameKey] || brandName.en || "";
}

function pickLocalizedText(
  field: ApiLocaleStrings | string | null | undefined,
  nameKey: keyof ApiProduct["name"],
): string {
  if (field == null) return "";
  if (typeof field === "string") return field.trim();
  const v = field[nameKey] ?? field.en;
  return typeof v === "string" ? v.trim() : "";
}

function mapAttributeRows(
  raw: ApiProduct,
  nameKey: keyof ApiProduct["name"],
): { slug: string; label: string; value: string }[] {
  const list = raw.attributes ?? [];
  return [...list]
    .sort((a, b) => a.sort_order - b.sort_order || a.id - b.id)
    .map((attr) => {
      let value = attr.value ?? "";
      if (attr.unit) value = `${value} ${attr.unit}`.trim();
      return {
        slug: attr.slug,
        label: attr.name[nameKey] || attr.name.en || attr.slug,
        value,
      };
    });
}

export function mapApiProductToProduct(
  raw: ApiProduct,
  locale: string,
): Product {
  const nameKey = localeToNameKey(locale);
  const { key: priceKey, code: currencyCode } = localeToCurrency(locale);
  const availability: Availability =
    raw.stock > 0 ? "in-stock" : "out-of-stock";

  const fromDescription = pickLocalizedText(raw.description, nameKey);
  const fromContent = pickLocalizedText(raw.content, nameKey);
  const description = fromDescription || fromContent;
  const attributeRows = mapAttributeRows(raw, nameKey);

  return {
    id: String(raw.id),
    name: raw.name[nameKey] || raw.name.en || "",
    slug: raw.slug,
    description,
    attributeRows: attributeRows.length ? attributeRows : undefined,
    price: (raw.price[priceKey] ?? raw.price.usd) * 100,
    currency: currencyCode,
    prices: {
      kzt: (raw.price.kzt ?? 0) * 100,
      rub: (raw.price.rub ?? 0) * 100,
      usd: (raw.price.usd ?? 0) * 100,
    },
    brand: pickBrand(raw.brand_name, nameKey),
    categoryId: String(raw.category_id),
    sku: raw.sku || "",
    availability,
    coverImage: raw.images[0] ?? "",
    gallery: raw.images,
    productType: categoryToProductType(raw.category_id),
    isSoon: raw.is_soon ?? false,
  } as Product;
}

export async function fetchProductsByCategory(
  categoryId: number,
  page = 1,
  pageSize = 20,
): Promise<ApiProductsResponse> {
  const url = `${normalizeApiBase()}/api/v1/products?category_id=${categoryId}&page=${page}&pageSize=${pageSize}`;
  const res = await fetch(url, {
    next: { revalidate: 60 },
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(
      `Failed to load products (${res.status} ${res.statusText})`,
    );
  }

  return res.json();
}

export async function fetchFeaturedProducts(
  page = 1,
  pageSize = 7,
): Promise<ApiProductsResponse> {
  const url = `${normalizeApiBase()}/api/v1/products?is_featured=1&page=${page}&page_size=${pageSize}`;
  const res = await fetch(url, {
    next: { revalidate: 60 },
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    return { page, page_size: pageSize, products: [], total: 0 };
  }

  return res.json();
}

export async function fetchProductBySlug(
  slug: string,
): Promise<ApiProduct | null> {
  const id = slug.split("-").pop();
  if (!id || !/^\d+$/.test(id)) return null;

  const url = `${normalizeApiBase()}/api/v1/products/${id}`;
  const res = await fetch(url, {
    next: { revalidate: 60 },
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    if (res.status === 404) return null;
    if (res.status >= 500) {
      throw new Error(
        `Product API server error (${res.status} ${res.statusText})`,
      );
    }
    throw new Error(
      `Failed to load product (${res.status} ${res.statusText})`,
    );
  }

  const product: ApiProduct = await res.json();
  if (product.slug !== slug) return null;

  return product;
}

export async function fetchAllProducts(
  page = 1,
  pageSize = 100,
): Promise<ApiProductsResponse> {
  const url = `${normalizeApiBase()}/api/v1/products?page=${page}&pageSize=${pageSize}`;
  const res = await fetch(url, {
    next: { revalidate: 60 },
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    return { page, page_size: pageSize, products: [], total: 0 };
  }

  return res.json();
}
