import { getLocale, getTranslations } from "next-intl/server";
import { ProductPageEmblaGallery } from "./ProductPageEmblaGallery";
import { ProductHero } from "./ProductHero";
import { ProductCta } from "./ProductCta";
import { resolveProductTemplate } from "./resolveProductTemplate";
import type { Product } from "@/entities/product";
import { getCategoryById } from "@/entities/category";

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
      <div className="grid min-w-0 gap-8 lg:grid-cols-2">
        <ProductPageEmblaGallery
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
