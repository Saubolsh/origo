"use client";

import { useTranslations } from "next-intl";
import { useState, useRef, useCallback, useEffect } from "react";
import type { Product, ApiProduct } from "@/entities/product";
import { mapApiProductToProduct } from "@/entities/product";
import { ProductGrid } from "./ProductGrid";

function loadMoreApiPath(): string {
  const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");
  return `${basePath}/api/origo/products`;
}

type ProductCatalogBaseProps = {
  initialProducts: Product[];
  locale: string;
  total: number;
  pageSize: number;
};

type ProductCatalogProps = ProductCatalogBaseProps &
  (
    | { mode: "category"; categoryId: string }
    | { mode: "featured" }
  );

function buildLoadMoreUrl(
  mode: ProductCatalogProps["mode"],
  categoryId: string | undefined,
  nextPage: number,
  pageSize: number,
): string {
  const path = loadMoreApiPath();
  if (mode === "featured") {
    return `${path}?is_featured=1&page=${nextPage}&page_size=${pageSize}`;
  }
  return `${path}?category_id=${categoryId}&page=${nextPage}&pageSize=${pageSize}`;
}

export function ProductCatalog(props: ProductCatalogProps) {
  const { initialProducts, locale, total, pageSize, mode } = props;
  const categoryId = mode === "category" ? props.categoryId : undefined;

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
      const url = buildLoadMoreUrl(mode, categoryId, nextPage, pageSize);
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Load more failed (${res.status})`);
      }
      const data: {
        products: ApiProduct[];
        total: number;
        page_size?: number;
      } = await res.json();
      const mapped = (data.products ?? []).map((p: ApiProduct) =>
        mapApiProductToProduct(p, locale),
      );

      setProducts((prev) => {
        const next = [...prev, ...mapped];
        setHasMore(next.length < data.total);
        return next;
      });
      setPage(nextPage);
    } catch (error) {
      console.error("Failed to load more products:", error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, categoryId, pageSize, locale, mode]);

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
              type="button"
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
