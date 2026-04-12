import type { Product } from "@/entities/product";
import { ProductSpecifications } from "../ProductSpecifications";
import { isToyFigureProduct } from "@/entities/product";

interface Props {
  product: Product;
}

export function ToyFigureTemplate({ product }: Props) {
  if (!isToyFigureProduct(product)) return null;

  const extraSpecs = [
    product.character && { label: "Character", value: product.character },
    product.franchise && { label: "Franchise", value: product.franchise },
    product.recommendedAge && {
      label: "Recommended age",
      value: product.recommendedAge,
    },
    product.material && { label: "Material", value: product.material },
  ].filter(Boolean) as { label: string; value: string | number }[];

  return (
    <section className="mt-12 border-t border-origo-zinc pt-12">
      <h2 className="text-lg font-semibold text-origo-white">
        Figure details
      </h2>
      <div className="mt-6">
        <ProductSpecifications extraRows={extraSpecs} className="max-w-md" />
      </div>
    </section>
  );
}
