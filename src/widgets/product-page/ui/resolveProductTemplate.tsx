import type { Product } from "@/entities/product";
import {
  isEngineeringModelProduct,
  isCollectibleFigureProduct,
  isStatueProduct,
  isModelKitProduct,
  isToyFigureProduct,
  isAccessoryProduct,
} from "@/entities/product";
import { EngineeringProductTemplate } from "./templates/EngineeringProductTemplate";
import { CollectibleFigureTemplate } from "./templates/CollectibleFigureTemplate";
import { StatueProductTemplate } from "./templates/StatueProductTemplate";
import { ModelKitProductTemplate } from "./templates/ModelKitProductTemplate";
import { ToyFigureTemplate } from "./templates/ToyFigureTemplate";
import { AccessoryProductTemplate } from "./templates/AccessoryProductTemplate";

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
