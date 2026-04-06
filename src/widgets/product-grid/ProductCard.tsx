import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/shared/lib/cn";
import type { Product } from "@/entities/product/types";

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
  const t = useTranslations("common");

  const Wrapper = product.isSoon ? "div" : Link;
  const wrapperProps = product.isSoon
    ? {}
    : { href: `/products/${product.slug}` };

  return (
    <Wrapper
      {...(wrapperProps as any)}
      className={cn(
        "group flex flex-col overflow-hidden rounded-lg border border-origo-zinc bg-origo-slate transition",
        !product.isSoon &&
          "hover:border-origo-accent/50 hover:shadow-lg hover:shadow-origo-accent/5",
        product.isSoon && "pointer-events-auto cursor-default",
        className
      )}
    >
      <div className="relative aspect-square overflow-hidden bg-origo-charcoal">
        <Image
          src={product.coverImage}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={cn(
            "object-cover transition duration-300",
            product.isSoon
              ? "brightness-[0.3] grayscale-[0.2]"
              : "group-hover:scale-105"
          )}
        />
        {product.isSoon && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="rounded-md bg-white/10 px-4 py-1.5 text-sm font-semibold uppercase tracking-widest text-white backdrop-blur-sm">
              {t("comingSoon")}
            </span>
          </div>
        )}
      </div>
      <div
        className={cn(
          "flex flex-1 flex-col p-4",
          product.isSoon && "opacity-50"
        )}
      >
        <p className="text-xs font-medium uppercase tracking-wide text-origo-muted">
          {product.brand}
        </p>
        <h3
          className={cn(
            "mt-1 font-semibold text-origo-white line-clamp-2",
            !product.isSoon && "group-hover:text-origo-accent"
          )}
        >
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
    </Wrapper>
  );
}
