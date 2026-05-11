"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { cn } from "@/shared/lib/cn";
import { trackClick } from "@/shared/lib/gtag";
import type { Category } from "@/entities/category";

interface CategoryCardProps {
  category: Category;
  className?: string;
}

export function CategoryCard({ category, className }: CategoryCardProps) {
  const href = `/categories/${category.slugPath.join("/")}`;

  return (
    <Link
      href={href}
      onClick={() =>
        trackClick("click_category", {
          name: category.name,
          slug: category.slug,
          path: category.slugPath.join("/"),
        })
      }
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg border border-origo-zinc bg-origo-slate transition hover:border-origo-accent/50 hover:shadow-lg hover:shadow-origo-accent/5",
        className
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-origo-charcoal">
        <Image
          src={category.image}
          alt={category.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-origo-black/90 via-origo-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-semibold text-origo-white group-hover:text-origo-accent">
            {category.name}
          </h3>
          {category.description && (
            <p className="mt-1 line-clamp-2 text-sm text-origo-silver">
              {category.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
