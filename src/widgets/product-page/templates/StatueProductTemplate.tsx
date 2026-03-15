import type { Product } from "@/entities/product/types";
import { ProductSpecifications } from "@/features/product-specs/ProductSpecifications";
import { isStatueProduct } from "@/entities/product/types";

interface Props {
  product: Product;
}

export function StatueProductTemplate({ product }: Props) {
  if (!isStatueProduct(product)) return null;

  const extraSpecs = [
    product.franchise && { label: "Franchise", value: product.franchise },
    product.scale && { label: "Scale", value: product.scale },
    product.artist && { label: "Artist", value: product.artist },
    product.certificateIncluded != null && {
      label: "Certificate of authenticity",
      value: product.certificateIncluded ? "Yes" : "No",
    },
    product.baseIncluded != null && {
      label: "Display base included",
      value: product.baseIncluded ? "Yes" : "No",
    },
  ].filter(Boolean) as { label: string; value: string | number }[];

  return (
    <section className="mt-12 border-t border-origo-zinc pt-12">
      <h2 className="text-lg font-semibold text-origo-white">
        Display & authenticity
      </h2>
      {product.artist && (
        <div className="mt-4 rounded-lg border border-origo-zinc bg-origo-slate p-4">
          <span className="text-xs text-origo-muted">Sculptor / Studio</span>
          <p className="font-medium text-origo-white">{product.artist}</p>
        </div>
      )}
      <div className="mt-6">
        <ProductSpecifications extraRows={extraSpecs} className="max-w-md" />
      </div>
      <div className="mt-6 space-y-3">
        {product.certificateIncluded && (
          <p className="text-sm text-origo-silver">
            Includes numbered certificate of authenticity.
          </p>
        )}
        {product.baseIncluded && (
          <p className="text-sm text-origo-silver">
            Custom display base included.
          </p>
        )}
      </div>
    </section>
  );
}
