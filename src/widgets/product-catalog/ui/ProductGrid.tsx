import type { Product } from "@/entities/product";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  className?: string;
}

export function ProductGrid({ products, className }: ProductGridProps) {
  if (!products.length) {
    return (
      <p className="py-12 text-center text-origo-muted">
        No products found.
      </p>
    );
  }
  return (
    <ul
      className={className}
      role="list"
    >
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
