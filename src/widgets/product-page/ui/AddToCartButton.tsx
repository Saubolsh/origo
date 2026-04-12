"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/shared/lib/cn";

const ORIGO_TELEGRAM_ORDER_URL = "https://t.me/origo_kz?direct";

interface AddToCartButtonProps {
  productName: string;
  className?: string;
}

export function AddToCartButton({ productName, className }: AddToCartButtonProps) {
  const t = useTranslations("common");

  return (
    <a
      href={ORIGO_TELEGRAM_ORDER_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex h-12 items-center justify-center rounded-md bg-origo-accent px-6 text-base font-medium text-origo-black transition-colors hover:bg-origo-accentHover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-origo-accent",
        className
      )}
      aria-label={t("buyTelegramAria", { productName })}
    >
      {t("buy")}
    </a>
  );
}
