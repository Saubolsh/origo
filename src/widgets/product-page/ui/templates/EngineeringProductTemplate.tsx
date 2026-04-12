import type { Product } from "@/entities/product";
import { ProductSpecifications } from "../ProductSpecifications";
import { isEngineeringModelProduct } from "@/entities/product";

interface Props {
  product: Product;
}

export function EngineeringProductTemplate({ product }: Props) {
  if (!isEngineeringModelProduct(product)) return null;

  const extraSpecs = [
    product.engineType && { label: "Engine type", value: product.engineType },
    product.partCount != null && {
      label: "Part count",
      value: product.partCount,
    },
    product.assemblyRequired != null && {
      label: "Assembly required",
      value: product.assemblyRequired ? "Yes" : "No",
    },
    product.movingParts != null && {
      label: "Moving parts",
      value: product.movingParts ? "Yes" : "No",
    },
    product.materials?.length && {
      label: "Materials",
      value: product.materials.join(", "),
    },
  ].filter(Boolean) as { label: string; value: string | number }[];

  return (
    <section className="mt-12 border-t border-origo-zinc pt-12">
      <h2 className="text-lg font-semibold text-origo-white">
        Engineering details
      </h2>
      <p className="mt-2 text-origo-silver">
        Precision metal model with assembly required. Ideal for display and
        education.
      </p>
      <div className="mt-6">
        <ProductSpecifications
          extraRows={extraSpecs}
          className="max-w-md"
        />
      </div>
      <div className="mt-6 rounded-lg border border-origo-zinc bg-origo-slate p-4">
        <h3 className="font-medium text-origo-white">Assembly</h3>
        <p className="mt-1 text-sm text-origo-silver">
          {product.assemblyRequired
            ? "This model requires assembly. Instructions and tools are included."
            : "Pre-assembled; no build required."}
        </p>
        {product.movingParts && (
          <p className="mt-2 text-sm text-origo-accent">
            Features moving parts for display.
          </p>
        )}
      </div>
    </section>
  );
}
