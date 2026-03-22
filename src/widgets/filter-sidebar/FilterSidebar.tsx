"use client";

import { useTranslations } from "next-intl";

export interface PriceRange {
  id: string;
  min: number;
  max: number | null;
  label: string;
  count: number;
}

interface FilterSidebarProps {
  brands: string[];
  selectedBrands: string[];
  onBrandChange: (brand: string) => void;
  priceRanges: PriceRange[];
  selectedPriceRanges: string[];
  onPriceRangeChange: (id: string) => void;
}

export function FilterSidebar({
  brands,
  selectedBrands,
  onBrandChange,
  priceRanges,
  selectedPriceRanges,
  onPriceRangeChange,
}: FilterSidebarProps) {
  const t = useTranslations("products.filters");

  const checkboxClass =
    "h-4 w-4 shrink-0 appearance-none rounded border border-origo-muted bg-origo-charcoal checked:border-origo-accent checked:bg-origo-accent focus:outline-none focus:ring-2 focus:ring-origo-accent/40 relative after:content-[''] after:absolute after:inset-0 after:flex after:items-center after:justify-center checked:after:content-['✓'] after:text-[10px] after:font-bold after:text-origo-black";

  return (
    <aside className="space-y-6 rounded-lg border border-origo-zinc bg-origo-slate p-5">
      {/* ─── Price ──────────────────────────────────────────────── */}
      <section>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-origo-white">
          {t("price")}
        </h3>
        <ul className="mt-3 space-y-2" role="list">
          {priceRanges.map((range) => {
            const checked = selectedPriceRanges.includes(range.id);
            return (
              <li key={range.id}>
                <label className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 transition hover:bg-origo-zinc/60">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onPriceRangeChange(range.id)}
                    className={checkboxClass}
                  />
                  <span
                    className={`text-sm transition ${
                      checked ? "text-origo-white" : "text-origo-silver"
                    }`}
                  >
                    {range.label}
                  </span>
                  <span className="ml-auto text-xs text-origo-muted">
                    ({range.count})
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ─── Brands ─────────────────────────────────────────────── */}
      <section>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-origo-white">
          {t("brands")}
        </h3>
        <ul className="mt-3 space-y-2" role="list">
          {brands.map((brand) => {
            const checked = selectedBrands.includes(brand);
            return (
              <li key={brand}>
                <label className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 transition hover:bg-origo-zinc/60">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onBrandChange(brand)}
                    className={checkboxClass}
                  />
                  <span
                    className={`text-sm transition ${
                      checked ? "text-origo-white" : "text-origo-silver"
                    }`}
                  >
                    {brand}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </section>
    </aside>
  );
}
