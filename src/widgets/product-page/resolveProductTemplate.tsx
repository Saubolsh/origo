import type { Product } from "@/entities/product/types";
import {
  isEngineeringModelProduct,
  isCollectibleFigureProduct,
  isStatueProduct,
  isModelKitProduct,
  isToyFigureProduct,
  isAccessoryProduct,
} from "@/entities/product/types";
import { EngineeringProductTemplate } from "@/widgets/product-page/templates/EngineeringProductTemplate";
import { CollectibleFigureTemplate } from "@/widgets/product-page/templates/CollectibleFigureTemplate";
import { StatueProductTemplate } from "@/widgets/product-page/templates/StatueProductTemplate";
import { ModelKitProductTemplate } from "@/widgets/product-page/templates/ModelKitProductTemplate";
import { ToyFigureTemplate } from "@/widgets/product-page/templates/ToyFigureTemplate";
import { AccessoryProductTemplate } from "@/widgets/product-page/templates/AccessoryProductTemplate";

/**
 * Resolves the product page template component based on productType.
 * Keeps the route universal (/products/[slug]) while rendering type-specific UI.
 */
export function resolveProductTemplate(product: Product): React.ComponentType<{ product: Product }> {
  if (isEngineeringModelProduct(product)) return EngineeringProductTemplate;
  if (isModelKitProduct(product)) return ModelKitProductTemplate;
  if (isCollectibleFigureProduct(product)) return CollectibleFigureTemplate;
  if (isToyFigureProduct(product)) return ToyFigureTemplate;
  if (isStatueProduct(product)) return StatueProductTemplate;
  if (isAccessoryProduct(product)) return AccessoryProductTemplate;

  // Fallback: generic product view (should not happen if all types are handled)
  return EngineeringProductTemplate as React.ComponentType<{ product: Product }>;
}
