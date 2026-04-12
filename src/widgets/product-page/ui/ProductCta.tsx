import { AddToCartButton } from "./AddToCartButton";
import type { Product } from "@/entities/product";

interface ProductCtaProps {
  product: Product;
  className?: string;
}

export function ProductCta({ product, className }: ProductCtaProps) {
  return (
    <div className={className}>
      <AddToCartButton productName={product.name} />
      </div>
  );
}
