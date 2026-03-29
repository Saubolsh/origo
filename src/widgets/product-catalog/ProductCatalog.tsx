"use client";

import { useMemo, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import type { Product } from "@/entities/product/types";
import { FilterSidebar } from "@/widgets/filter-sidebar";
import type { PriceRange } from "@/widgets/filter-sidebar/FilterSidebar";
import { ProductGrid } from "@/widgets/product-grid";
import { SortDropdown } from "@/widgets/sort-dropdown";
import type { SortOption } from "@/widgets/sort-dropdown";

interface ProductCatalogProps {
  products: Product[];
}

/* Price buckets in cents ─────────────────────────────────────────────── */
const PRICE_BOUNDARIES = [
  { id: "p-0-50", min: 0, max: 5000 },
  { id: "p-50-100", min: 5000, max: 10000 },
  { id: "p-100-250", min: 10000, max: 25000 },
  { id: "p-250-500", min: 25000, max: 50000 },
  { id: "p-500+", min: 50000, max: null },
] as const;

function formatUsd(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

/* Sorting helpers ────────────────────────────────────────────────────── */
function sortProducts(products: Product[], sort: SortOption): Product[] {
  const sorted = [...products];
  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    default:
      return sorted;
  }
}

export function ProductCatalog({ products }: ProductCatalogProps) {
  const t = useTranslations("products.filters");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("price-asc");

  /* Extract unique brands from products, sorted alphabetically */
  const brands = useMemo(() => {
    const set = new Set(products.map((p) => p.brand));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [products]);

  /* Build price ranges with counts and labels ────────────────────────── */
  const priceRanges: PriceRange[] = useMemo(() => {
    return PRICE_BOUNDARIES.map(({ id, min, max }) => {
      const count = products.filter(
        (p) => p.price >= min && (max === null || p.price < max)
      ).length;

      const label =
        max === null
          ? t("priceAbove", { value: formatUsd(min) })
          : min === 0
            ? t("priceUpTo", { value: formatUsd(max) })
            : `${formatUsd(min)} – ${formatUsd(max)}`;

      return { id, min, max, label, count };
    }).filter((r) => r.count > 0);
  }, [products, t]);

  /* Toggle handlers ──────────────────────────────────────────────────── */
  const handleBrandChange = useCallback((brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand)
        ? prev.filter((b) => b !== brand)
        : [...prev, brand]
    );
  }, []);

  const handlePriceRangeChange = useCallback((id: string) => {
    setSelectedPriceRanges((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  }, []);

  /* Filter + sort products ───────────────────────────────────────────── */
  const filtered = useMemo(() => {
    let result = products;

    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.includes(p.brand));
    }

    if (selectedPriceRanges.length > 0) {
      const activeBuckets = PRICE_BOUNDARIES.filter((b) =>
        selectedPriceRanges.includes(b.id)
      );
      result = result.filter((p) =>
        activeBuckets.some(
          (b) => p.price >= b.min && (b.max === null || p.price < b.max)
        )
      );
    }

    return sortProducts(result, sortBy);
  }, [products, selectedBrands, selectedPriceRanges, sortBy]);

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
      <FilterSidebar
        brands={brands}
        selectedBrands={selectedBrands}
        onBrandChange={handleBrandChange}
        priceRanges={priceRanges}
        selectedPriceRanges={selectedPriceRanges}
        onPriceRangeChange={handlePriceRangeChange}
      />
      <div>
        {/* Sort bar */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-origo-muted">
            {filtered.length}{" "}
            {filtered.length === 1 ? t("productCount_one") : t("productCount_other")}
          </p>
          <SortDropdown value={sortBy} onChange={setSortBy} />
        </div>

        <ProductGrid
          products={filtered}
          className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
        />
      </div>
    </div>
  );
}
