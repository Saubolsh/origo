import { AddToCartButton } from "@/features/add-to-cart/AddToCartButton";
import type { Product } from "@/entities/product/types";

interface ProductCtaProps {
  product: Product;
  className?: string;
}

export function ProductCta({ product, className }: ProductCtaProps) {
  return (
    <div className={className}>
      <AddToCartButton
        availability={product.availability}
        productName={product.name}
      />
      <p className="mt-3 text-xs text-origo-muted">
        Need help?{" "}
        <a href="/contact" className="text-origo-accent hover:underline">
          Contact us
        </a>
      </p>
    </div>
  );
}
