import { cn } from "@/shared/lib/cn";
import type { ProductBadge as ProductBadgeType } from "@/shared/types/product";

interface ProductBadgesProps {
  badges?: ProductBadgeType[];
  className?: string;
}

export function ProductBadges({ badges, className }: ProductBadgesProps) {
  if (!badges?.length) return null;
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {badges.map((badge) => (
        <span
          key={badge}
          className="rounded border border-origo-accent/50 bg-origo-accent/10 px-2 py-0.5 text-xs font-medium text-origo-accent"
        >
          {badge}
        </span>
      ))}
    </div>
  );
}
