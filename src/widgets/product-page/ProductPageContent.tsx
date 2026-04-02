import { getLocale, getTranslations } from "next-intl/server";
import { ProductGallery } from "@/features/product-gallery/ProductGallery";
import { ProductHero } from "@/widgets/product-hero";
import { ProductCta } from "@/widgets/product-cta";
import { resolveProductTemplate } from "./resolveProductTemplate";
import type { Product } from "@/entities/product/types";
import { getCategoryById } from "@/entities/category/api";

interface ProductPageContentProps {
  product: Product;
}

export async function ProductPageContent({ product }: ProductPageContentProps) {
  const locale = await getLocale();
  const category = await getCategoryById(product.categoryId, locale);
  const Template = resolveProductTemplate(product);
  const t = await getTranslations("product");

  return (
    <article className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* 1. Hero + Gallery row */}
      <div className="grid gap-8 lg:grid-cols-2">
        <ProductGallery
          coverImage={product.coverImage}
          gallery={product.gallery}
          productName={product.name}
        />
        <div className="flex flex-col">
          <ProductHero
            product={product}
            category={category}
            brandLabel={t("brandLabel")}
            categoryLabel={t("categoryLabel")}
            locale={locale}
            priceLabel={t("priceLabel")}
            skuLabel={t("skuLabel")}
            specificationsTitle={t("specificationsTitle")}
          />
          <div className="mt-6">
            <ProductCta product={product} />
          </div>
        </div>
      </div>
    </article>
  );
}
