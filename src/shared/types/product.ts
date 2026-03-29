import { Category } from "./category";

export type ProductType =
  | "engineering-model"
  | "model-kit"
  | "collectible-figure"
  | "toy-figure"
  | "statue"
  | "accessory";

export type Availability = "in-stock" | "preorder" | "out-of-stock";

export type ProductBadge = "New" | "Limited" | "Best Seller" | "Exclusive";

export interface ProductBase {
  id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  description: string;
  price: Record<string, number>;
  brand: string;
  category: Category;
  product: ProductType;
  coverImage: string;
  gallery: string[];
}

// ─── Type-specific detail interfaces ─────────────────────────────────────

export interface EngineeringModelDetails {
  productType: "engineering-model";
  engineType?: string;
  partCount?: number;
  assemblyRequired?: boolean;
  movingParts?: boolean;
  materials?: string[];
}

export interface ModelKitDetails {
  productType: "model-kit";
  difficultyLevel?: string;
  partsIncluded?: number;
  assemblyRequired?: boolean;
  recommendedAge?: string;
}

export interface CollectibleFigureDetails {
  productType: "collectible-figure";
  character?: string;
  franchise?: string;
  articulated?: boolean;
  accessoriesIncluded?: string[];
  heightCm?: number;
}

export interface ToyFigureDetails {
  productType: "toy-figure";
  character?: string;
  franchise?: string;
  recommendedAge?: string;
  material?: string;
}

export interface StatueDetails {
  productType: "statue";
  franchise?: string;
  scale?: string;
  artist?: string;
  certificateIncluded?: boolean;
  baseIncluded?: boolean;
}

export interface AccessoryDetails {
  productType: "accessory";
  accessoryType?: string;
  compatibility?: string[];
  material?: string;
}

// ─── Discriminated union ───────────────────────────────────────────────────

export type ProductDetails =
  | EngineeringModelDetails
  | ModelKitDetails
  | CollectibleFigureDetails
  | ToyFigureDetails
  | StatueDetails
  | AccessoryDetails;

export type Product = ProductBase & ProductDetails;

// ─── Type guards ───────────────────────────────────────────────────────────

export function isEngineeringModelProduct(
  product: Product
): product is ProductBase & EngineeringModelDetails {
  return product.productType === "engineering-model";
}

export function isModelKitProduct(
  product: Product
): product is ProductBase & ModelKitDetails {
  return product.productType === "model-kit";
}

export function isCollectibleFigureProduct(
  product: Product
): product is ProductBase & CollectibleFigureDetails {
  return product.productType === "collectible-figure";
}

export function isToyFigureProduct(
  product: Product
): product is ProductBase & ToyFigureDetails {
  return product.productType === "toy-figure";
}

export function isStatueProduct(
  product: Product
): product is ProductBase & StatueDetails {
  return product.productType === "statue";
}

export function isAccessoryProduct(
  product: Product
): product is ProductBase & AccessoryDetails {
  return product.productType === "accessory";
}
