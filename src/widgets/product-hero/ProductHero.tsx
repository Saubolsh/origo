// import { AvailabilityBadge } from "@/features/product-availability/AvailabilityBadge";
// import { ProductBadges } from "@/features/product-badges/ProductBadges";
import type { Product } from "@/entities/product/types";
import type { Category } from "@/shared/types";
import { Link } from "@/i18n/navigation";
import { ProductSpecifications } from "@/features/product-specs/ProductSpecifications";

function formatPrice(
  priceCents: number,
  currency: string,
  locale: string,
): string {
  const tag = locale === "kz" ? "kk-KZ" : locale;
  return new Intl.NumberFormat(tag, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(priceCents / 100);
}

const CURRENCY_ORDER = [
  { key: "kzt" as const, code: "KZT" },
  { key: "rub" as const, code: "RUB" },
  { key: "usd" as const, code: "USD" },
];

interface ProductHeroProps {
  product: Product;
  className?: string;
  category: Category | null;
  categoryLabel: string;
  priceLabel: string;
  brandLabel: string;
  skuLabel: string;
  specificationsTitle: string;
  locale: string;
}

export function ProductHero({
  brandLabel,
  category,
  categoryLabel,
  locale,
  priceLabel,
  product,
  skuLabel,
  specificationsTitle,
  className,
}: ProductHeroProps) {
  return (
    <div className={className}>
      {/* In-stock + Best Seller / promo badges — disabled for now
      <div className="flex flex-wrap items-center gap-2">
        <AvailabilityBadge availability={product.availability} />
        <ProductBadges badges={product.badges} />
      </div>
      */}

      <h1 className="mt-3 text-2xl font-bold tracking-tight text-origo-white sm:text-3xl">
        {product.name}
      </h1>

      {product.shortDescription ? (
        <p className="mt-2 text-base leading-snug text-origo-silver">
          {product.shortDescription}
        </p>
      ) : null}

      {product.description ? (
        <p className="mt-4 max-w-prose text-sm leading-relaxed text-origo-white/90 sm:text-base">
          {product.description}
        </p>
      ) : null}

      <ProductSpecifications
        attributeRows={product.attributeRows}
        className="mt-5"
        extraRows={[]}
        specifications={product.specifications ?? {}}
        title={specificationsTitle}
      />

      <div className="mt-6 border-t border-origo-zinc/50 pt-6">
        <p className="text-xs font-medium uppercase tracking-wide text-origo-muted">
          {priceLabel}
        </p>
        {product.prices ? (
          <p className="mt-1 flex flex-wrap items-baseline gap-x-3 text-2xl font-semibold tracking-tight text-origo-accent sm:text-3xl">
            {CURRENCY_ORDER.map(({ key, code }, i) => (
              <span key={code}>
                {i > 0 && (
                  <span className="mr-3 text-origo-zinc/50">/</span>
                )}
                {formatPrice(product.prices![key], code, locale)}
              </span>
            ))}
          </p>
        ) : (
          <p className="mt-1 text-3xl font-semibold tracking-tight text-origo-accent">
            {formatPrice(product.price, product.currency, locale)}
          </p>
        )}
      </div>

      <dl className="mt-6 space-y-3 text-sm">
        <div className="grid gap-1 sm:grid-cols-[minmax(0,7rem)_1fr] sm:items-baseline sm:gap-x-4">
          <dt className="text-origo-muted">{brandLabel}</dt>
          <dd className="font-medium text-origo-white">{product.brand}</dd>
        </div>
        {product.sku ? (
          <div className="grid gap-1 sm:grid-cols-[minmax(0,7rem)_1fr] sm:items-baseline sm:gap-x-4">
            <dt className="text-origo-muted">{skuLabel}</dt>
            <dd className="break-all font-mono text-xs text-origo-silver sm:text-sm">
              {product.sku}
            </dd>
          </div>
        ) : null}
        {category ? (
          <div className="grid gap-1 sm:grid-cols-[minmax(0,7rem)_1fr] sm:items-baseline sm:gap-x-4">
            <dt className="text-origo-muted">{categoryLabel}</dt>
            <dd>
              <Link
                href={`/categories/${category.slug}`}
                className="font-medium text-origo-accent hover:underline"
              >
                {category.name}
              </Link>
            </dd>
          </div>
        ) : null}
      </dl>
    </div>
  );
}
