"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/shared/lib/cn";
import type { Availability } from "@/shared/types/product";

interface AvailabilityBadgeProps {
  availability: Availability;
  className?: string;
}

const availabilityStyles: Record<
  Availability,
  { bg: string; text: string; border?: string }
> = {
  "in-stock": { bg: "bg-emerald-500/20", text: "text-emerald-400" },
  preorder: { bg: "bg-amber-500/20", text: "text-amber-400" },
  "out-of-stock": { bg: "bg-origo-zinc", text: "text-origo-muted" },
};

const availabilityKeys: Record<Availability, string> = {
  "in-stock": "availability.inStock",
  preorder: "availability.preorder",
  "out-of-stock": "availability.outOfStock",
};

export function AvailabilityBadge({
  availability,
  className,
}: AvailabilityBadgeProps) {
  const t = useTranslations("common");
  const style = availabilityStyles[availability];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        style.bg,
        style.text,
        className
      )}
    >
      {t(availabilityKeys[availability])}
    </span>
  );
}
