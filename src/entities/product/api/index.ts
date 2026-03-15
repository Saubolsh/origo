import type { Product } from "../types";
import { productsData } from "./data";

export async function getProducts(): Promise<Product[]> {
  return productsData;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return productsData.find((p) => p.slug === slug) ?? null;
}

export async function getProductsByCategory(
  categoryId: string
): Promise<Product[]> {
  return productsData.filter((p) => p.categoryId === categoryId);
}

export async function getProductsByType(
  productType: Product["productType"]
): Promise<Product[]> {
  return productsData.filter((p) => p.productType === productType);
}
