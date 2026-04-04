import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import {
  getCategoryBySlug,
  getCategorySlugStaticParams,
} from "@/entities/category/api";
import { getProductsByCategory } from "@/entities/product/api";
import { ProductCatalog } from "@/widgets/product-catalog";
import { canonicalUrl } from "@/shared/lib/seo-url";

export const revalidate = 60;

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  return getCategorySlugStaticParams();
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const category = await getCategoryBySlug(slug, locale);
  const t = await getTranslations({ locale, namespace: "categories" });
  if (!category) return { title: t("notFound") };

  const canonical = canonicalUrl(locale, `/categories/${category.slug}/`);
  const title = category.name;
  const description = category.description;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      images: [{ url: category.image, alt: category.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [category.image],
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const category = await getCategoryBySlug(slug, locale);
  if (!category) notFound();

  const { products, total, pageSize } = await getProductsByCategory(
    category.id,
    locale,
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-origo-white">
        {category.name}
      </h1>
      {category.description && (
        <p className="mt-2 text-origo-silver">{category.description}</p>
      )}
      <ProductCatalog
        initialProducts={products}
        categoryId={category.id}
        locale={locale}
        total={total}
        pageSize={pageSize}
      />
    </div>
  );
}

