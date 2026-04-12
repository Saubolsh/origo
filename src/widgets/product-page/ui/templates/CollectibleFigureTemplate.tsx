import type { Product } from "@/entities/product";
import { ProductSpecifications } from "../ProductSpecifications";
import { isCollectibleFigureProduct } from "@/entities/product";

interface Props {
  product: Product;
}

export function CollectibleFigureTemplate({ product }: Props) {
  if (!isCollectibleFigureProduct(product)) return null;

  const extraSpecs = [
    product.character && { label: "Character", value: product.character },
    product.franchise && { label: "Franchise", value: product.franchise },
    product.articulated != null && {
      label: "Articulated",
      value: product.articulated ? "Yes" : "No",
    },
    product.heightCm != null && {
      label: "Height",
      value: `${product.heightCm} cm`,
    },
    product.accessoriesIncluded?.length && {
      label: "Accessories included",
      value: product.accessoriesIncluded.join(", "),
    },
  ].filter(Boolean) as { label: string; value: string | number }[];

  return (
    <section className="mt-12 border-t border-origo-zinc pt-12">
      <h2 className="text-lg font-semibold text-origo-white">
        Character & franchise
      </h2>
      {(product.character || product.franchise) && (
        <div className="mt-4 flex flex-wrap gap-4">
          {product.character && (
            <div className="rounded-lg border border-origo-zinc bg-origo-slate px-4 py-2">
              <span className="text-xs text-origo-muted">Character</span>
              <p className="font-medium text-origo-white">{product.character}</p>
            </div>
          )}
          {product.franchise && (
            <div className="rounded-lg border border-origo-zinc bg-origo-slate px-4 py-2">
              <span className="text-xs text-origo-muted">Franchise</span>
              <p className="font-medium text-origo-white">{product.franchise}</p>
            </div>
          )}
        </div>
      )}
      <div className="mt-6">
        <ProductSpecifications extraRows={extraSpecs} className="max-w-md" />
      </div>
      {product.accessoriesIncluded && product.accessoriesIncluded.length > 0 && (
        <div className="mt-6 rounded-lg border border-origo-zinc bg-origo-slate p-4">
          <h3 className="font-medium text-origo-white">Accessories included</h3>
          <ul className="mt-2 list-inside list-disc text-sm text-origo-silver">
            {product.accessoriesIncluded.map((acc) => (
              <li key={acc}>{acc}</li>
            ))}
          </ul>
        </div>
      )}
      {product.articulated != null && (
        <p className="mt-4 text-sm text-origo-silver">
          {product.articulated
            ? "This figure features articulation for multiple poses."
            : "Static pose; not articulated."}
        </p>
      )}
    </section>
  );
}
