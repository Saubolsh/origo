"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/shared/lib/cn";
import { trackClick } from "@/shared/lib/gtag";

const ORIGO_TELEGRAM_ORDER_URL = "https://t.me/origo_kz?direct";

interface AddToCartButtonProps {
  productName: string;
  showOrder?: boolean;
  className?: string;
}

export function AddToCartButton({
  productName,
  showOrder = false,
  className,
}: AddToCartButtonProps) {
  const t = useTranslations("common");

  return (
    <a
      href={ORIGO_TELEGRAM_ORDER_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackClick("click_buy", { product: productName })}
      className={cn(
        "inline-flex h-12 items-center justify-center rounded-md bg-origo-accent px-6 text-base font-medium text-origo-black transition-colors hover:bg-origo-accentHover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-origo-accent",
        className
      )}
      aria-label={t("buyTelegramAria", { productName })}
    >
      {t(showOrder ? "order" : "buy")}
    </a>
  );
}
