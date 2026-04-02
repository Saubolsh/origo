"use client";

import { useTranslations } from "next-intl";
import type { Product } from "@/entities/product/types";
import { ProductGrid } from "@/widgets/product-grid";

/* Filter / sort UI disabled for now. Previous implementation used:
   - @/widgets/filter-sidebar (FilterSidebar)
   - @/widgets/sort-dropdown (SortDropdown)
   - Client state: brands, price ranges, sortBy + filtered/sorted list via useMemo
*/

interface ProductCatalogProps {
  products: Product[];
}

export function ProductCatalog({ products }: ProductCatalogProps) {
  const t = useTranslations("products.filters");

  return (
    <div className="mt-8">
      <div className="mb-6">
        <p className="text-sm text-origo-muted">
          {products.length}{" "}
          {products.length === 1 ? t("productCount_one") : t("productCount_other")}
        </p>
      </div>

      <ProductGrid
        products={products}
        className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
      />
    </div>
  );
}
