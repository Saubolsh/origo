import type { Category } from "@/entities/category";
import { CategoryCard } from "./CategoryCard";

interface CategoryGridProps {
  categories: Category[];
  className?: string;
}

export function CategoryGrid({ categories, className }: CategoryGridProps) {
  if (!categories.length) {
    return (
      <p className="py-12 text-center text-origo-muted">
        No categories found.
      </p>
    );
  }
  return (
    <ul className={className} role="list">
      {categories.map((category) => (
        <li key={category.id}>
          <CategoryCard category={category} />
        </li>
      ))}
    </ul>
  );
}
