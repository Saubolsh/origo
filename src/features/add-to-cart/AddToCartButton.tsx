"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/shared/ui/Button";
import type { Availability } from "@/shared/types/product";

interface AddToCartButtonProps {
  availability: Availability;
  productName: string;
  onAdd?: () => void;
  className?: string;
}

export function AddToCartButton({
  availability,
  productName,
  onAdd,
  className,
}: AddToCartButtonProps) {
  const t = useTranslations("common");
  const isOutOfStock = availability === "out-of-stock";

  return (
    <Button
      type="button"
      size="lg"
      disabled={isOutOfStock}
      onClick={onAdd}
      className={className}
      aria-label={
        isOutOfStock
          ? t("outOfStockAria", { productName })
          : t("addToCartAria", { productName })
      }
    >
      {availability === "preorder"
        ? t("preorderButton")
        : isOutOfStock
          ? t("outOfStockButton")
          : t("addToCart")}
    </Button>
  );
}
