"use client";

import { useTranslations } from "next-intl";
import { useState, useRef, useCallback, useEffect } from "react";
import type { Product } from "@/entities/product/types";
import type { ApiProduct } from "@/entities/product/api";
import { mapApiProductToProduct } from "@/entities/product/api";
import { ProductGrid } from "@/widgets/product-grid";

const API_BASE =
  (
    process.env.NEXT_PUBLIC_ORIGO_API_BASE?.trim() ?? "https://api.origo.kz"
  ).replace(/\/$/, "");

interface ProductCatalogProps {
  initialProducts: Product[];
  categoryId: string;
  locale: string;
  total: number;
  pageSize: number;
}

export function ProductCatalog({
  initialProducts,
  categoryId,
  locale,
  total,
  pageSize,
}: ProductCatalogProps) {
  const t = useTranslations("products.filters");
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialProducts.length < total);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<() => void>(() => {});

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const nextPage = page + 1;
      const res = await fetch(
        `${API_BASE}/api/v1/products?category_id=${categoryId}&page=${nextPage}&pageSize=${pageSize}`,
      );
      const data: { products: ApiProduct[]; total: number } = await res.json();
      const mapped = (data.products ?? []).map((p: ApiProduct) =>
        mapApiProductToProduct(p, locale),
      );

      setProducts((prev) => [...prev, ...mapped]);
      setPage(nextPage);
      setHasMore(nextPage * pageSize < data.total);
    } catch (error) {
      console.error("Failed to load more products:", error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, categoryId, pageSize, locale]);

  loadMoreRef.current = loadMore;

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMoreRef.current();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore]);

  return (
    <div className="mt-8">
      <div className="mb-6">
        <p className="text-sm text-origo-muted">
          {total}{" "}
          {total === 1 ? t("productCount_one") : t("productCount_other")}
        </p>
      </div>

      <ProductGrid
        products={products}
        className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
      />

      {hasMore && (
        <div ref={sentinelRef} className="flex justify-center py-8">
          {loading ? (
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-origo-accent border-t-transparent" />
          ) : (
            <button
              onClick={loadMore}
              className="text-sm text-origo-muted transition hover:text-origo-accent"
            >
              {t("loadMore")}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
