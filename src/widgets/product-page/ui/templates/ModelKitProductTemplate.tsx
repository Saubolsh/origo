import type { Product } from "@/entities/product";
import { ProductSpecifications } from "../ProductSpecifications";
import { isModelKitProduct } from "@/entities/product";

interface Props {
  product: Product;
}

export function ModelKitProductTemplate({ product }: Props) {
  if (!isModelKitProduct(product)) return null;

  const extraSpecs = [
    product.difficultyLevel && {
      label: "Difficulty",
      value: product.difficultyLevel,
    },
    product.partsIncluded != null && {
      label: "Parts included",
      value: product.partsIncluded,
    },
    product.assemblyRequired != null && {
      label: "Assembly required",
      value: product.assemblyRequired ? "Yes" : "No",
    },
    product.recommendedAge && {
      label: "Recommended age",
      value: product.recommendedAge,
    },
  ].filter(Boolean) as { label: string; value: string | number }[];

  return (
    <section className="mt-12 border-t border-origo-zinc pt-12">
      <h2 className="text-lg font-semibold text-origo-white">
        Kit details
      </h2>
      <div className="mt-6">
        <ProductSpecifications extraRows={extraSpecs} className="max-w-md" />
      </div>
    </section>
  );
}
