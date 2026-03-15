import type { Product } from "@/entities/product/types";
import { ProductSpecifications } from "@/features/product-specs/ProductSpecifications";
import { isAccessoryProduct } from "@/entities/product/types";

interface Props {
  product: Product;
}

export function AccessoryProductTemplate({ product }: Props) {
  if (!isAccessoryProduct(product)) return null;

  const extraSpecs = [
    product.accessoryType && {
      label: "Type",
      value: product.accessoryType,
    },
    product.material && { label: "Material", value: product.material },
    product.compatibility?.length && {
      label: "Compatibility",
      value: product.compatibility.join(", "),
    },
  ].filter(Boolean) as { label: string; value: string | number }[];

  return (
    <section className="mt-12 border-t border-origo-zinc pt-12">
      <h2 className="text-lg font-semibold text-origo-white">
        Compatibility & usage
      </h2>
      <div className="mt-6">
        <ProductSpecifications extraRows={extraSpecs} className="max-w-md" />
      </div>
    </section>
  );
}
