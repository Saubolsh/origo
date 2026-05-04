import { AddToCartButton } from "./AddToCartButton";
import type { Product } from "@/entities/product";

interface ProductCtaProps {
  product: Product;
  className?: string;
}

export function ProductCta({ product, className }: ProductCtaProps) {
  const hasPrice = typeof product.price === "number";

  return (
    <div className={className}>
      <AddToCartButton productName={product.name} showOrder={!hasPrice} />
    </div>
  );
}
