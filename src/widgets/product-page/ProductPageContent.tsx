import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ProductGallery } from "@/features/product-gallery/ProductGallery";
import { ProductSpecifications } from "@/features/product-specs/ProductSpecifications";
import { ProductHero } from "@/widgets/product-hero";
import { ProductCta } from "@/widgets/product-cta";
import { resolveProductTemplate } from "./resolveProductTemplate";
import type { Product } from "@/entities/product/types";
import { getCategoryById } from "@/entities/category/api";

interface ProductPageContentProps {
  product: Product;
}

export async function ProductPageContent({ product }: ProductPageContentProps) {
  const category = await getCategoryById(product.categoryId);
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
          <ProductHero product={product} />
          <div className="mt-6">
            <ProductCta product={product} />
          </div>
        </div>
      </div>

      {/* 2. Basic Information */}
      <section className="mt-12 border-t border-origo-zinc pt-12">
        <h2 className="text-lg font-semibold text-origo-white">
          {t("descriptionLabel")}
        </h2>
        <p className="mt-2 text-origo-silver">{product.description}</p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-origo-muted">
          {category && (
            <span>
              {t("categoryLabel")}:{" "}
              <Link
                href={`/categories/${category.slug}`}
                className="text-origo-accent hover:underline"
              >
                {category.name}
              </Link>
            </span>
          )}
          <span>{t("brandLabel")}: {product.brand}</span>
        </div>
      </section>

      {/* 3. Specifications (common + type-specific via Template) */}
      <section className="mt-12 border-t border-origo-zinc pt-12">
        <ProductSpecifications
          specifications={product.specifications}
          extraRows={[]}
        />
      </section>

      {/* 4. Type-specific dynamic sections */}
      <Template product={product} />
    </article>
  );
}
