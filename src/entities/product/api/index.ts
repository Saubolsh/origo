import type { Product } from "../types";
import { productsData } from "./data";
import {
  fetchProductsByCategory,
  fetchProductBySlug,
  fetchAllProducts,
  mapApiProductToProduct,
} from "./fetch-products";

export type { ApiProduct, ApiProductsResponse } from "./fetch-products";
export { mapApiProductToProduct } from "./fetch-products";

export interface PaginatedProducts {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
}

export async function getProducts(): Promise<Product[]> {
  return productsData;
}

export async function getProductBySlug(
  slug: string,
  locale: string,
): Promise<Product | null> {
  const hardcoded = productsData.find((p) => p.slug === slug);
  if (hardcoded) return hardcoded;

  const match = await fetchProductBySlug(slug);
  return match ? mapApiProductToProduct(match, locale) : null;
}

export async function getProductsByCategory(
  categoryId: string,
  locale: string,
  page = 1,
  pageSize = 20,
): Promise<PaginatedProducts> {
  const data = await fetchProductsByCategory(
    Number(categoryId),
    page,
    pageSize,
  );
  return {
    products: (data.products ?? []).map((p) =>
      mapApiProductToProduct(p, locale),
    ),
    total: data.total,
    page: data.page,
    pageSize: data.page_size,
  };
}

export async function getProductsByType(
  productType: Product["productType"],
): Promise<Product[]> {
  return productsData.filter((p) => p.productType === productType);
}

export async function getAllProductSlugs(): Promise<string[]> {
  const hardcodedSlugs = productsData.map((p) => p.slug);

  try {
    const data = await fetchAllProducts();
    const apiSlugs = (data.products ?? []).map((p) => p.slug);
    return [...new Set([...hardcodedSlugs, ...apiSlugs])];
  } catch {
    return hardcodedSlugs;
  }
}
