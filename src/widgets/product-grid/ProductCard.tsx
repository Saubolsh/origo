import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { cn } from "@/shared/lib/cn";
import type { Product } from "@/entities/product/types";
// import { AvailabilityBadge } from "@/features/product-availability/AvailabilityBadge";
// import { ProductBadges } from "@/features/product-badges/ProductBadges";

function formatPrice(price: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price / 100);
}

const CURRENCY_ORDER = [
  { key: "kzt" as const, code: "KZT" },
  { key: "rub" as const, code: "RUB" },
  { key: "usd" as const, code: "USD" },
];

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-lg border border-origo-zinc bg-origo-slate transition hover:border-origo-accent/50 hover:shadow-lg hover:shadow-origo-accent/5",
        className
      )}
    >
      <div className="relative aspect-square overflow-hidden bg-origo-charcoal">
        <Image
          src={product.coverImage}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
        {/* In-stock + Best Seller / promo badges — disabled for now
        <div className="absolute left-2 top-2 flex flex-wrap gap-1.5">
          <AvailabilityBadge availability={product.availability} />
          <ProductBadges badges={product.badges} />
        </div>
        */}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-origo-muted">
          {product.brand}
        </p>
        <h3 className="mt-1 font-semibold text-origo-white line-clamp-2 group-hover:text-origo-accent">
          {product.name}
        </h3>
        {product.shortDescription && (
          <p className="mt-1.5 line-clamp-2 text-sm text-origo-silver">
            {product.shortDescription}
          </p>
        )}
        {product.prices ? (
          <p className="mt-auto flex flex-wrap items-baseline gap-x-2 pt-3 text-sm font-semibold text-origo-accent sm:text-base">
            {CURRENCY_ORDER.map(({ key, code }, i) => (
              <span key={code}>
                {i > 0 && (
                  <span className="mr-2 text-origo-zinc/50">/</span>
                )}
                {formatPrice(product.prices![key], code)}
              </span>
            ))}
          </p>
        ) : (
          <p className="mt-auto pt-3 text-lg font-semibold text-origo-accent">
            {formatPrice(product.price, product.currency)}
          </p>
        )}
      </div>
    </Link>
  );
}
