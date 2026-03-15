import { AvailabilityBadge } from "@/features/product-availability/AvailabilityBadge";
import { ProductBadges } from "@/features/product-badges/ProductBadges";
import type { Product } from "@/entities/product/types";

function formatPrice(price: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price / 100);
}

interface ProductHeroProps {
  product: Product;
  className?: string;
}

export function ProductHero({ product, className }: ProductHeroProps) {
  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-2">
        <AvailabilityBadge availability={product.availability} />
        <ProductBadges badges={product.badges} />
      </div>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-origo-white sm:text-3xl">
        {product.name}
      </h1>
      <p className="mt-1 text-lg text-origo-accent">
        {formatPrice(product.price, product.currency)}
      </p>
      {product.shortDescription && (
        <p className="mt-3 text-origo-silver">{product.shortDescription}</p>
      )}
      <p className="mt-1 text-sm text-origo-muted">
        {product.brand}
        {product.sku && ` · SKU: ${product.sku}`}
      </p>
    </div>
  );
}
