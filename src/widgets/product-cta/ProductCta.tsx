import { AddToCartButton } from "@/features/add-to-cart/AddToCartButton";
import type { Product } from "@/entities/product/types";

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
