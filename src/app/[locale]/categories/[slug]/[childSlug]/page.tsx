import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import {
  getCategoryBySlugPath,
  getCategoryChildSlugStaticParams,
} from "@/entities/category";
import { getProductsByCategory } from "@/entities/product";
import { ProductCatalog } from "@/widgets/product-catalog";
import { canonicalUrl } from "@/shared/lib/seo-url";

export const revalidate = 60;

type Props = {
  params: Promise<{ locale: string; slug: string; childSlug: string }>;
};

export async function generateStaticParams() {
  const pairs = await getCategoryChildSlugStaticParams();
  return pairs.map(({ parentSlug, childSlug }) => ({
    slug: parentSlug,
    childSlug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug, childSlug } = await params;
  const category = await getCategoryBySlugPath([slug, childSlug], locale);
  const t = await getTranslations({ locale, namespace: "categories" });
  if (!category) return { title: t("notFound") };

  const canonical = canonicalUrl(
    locale,
    `/categories/${slug}/${childSlug}/`,
  );
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

export default async function SubcategoryPage({ params }: Props) {
  const { locale, slug, childSlug } = await params;
  setRequestLocale(locale);

  const category = await getCategoryBySlugPath([slug, childSlug], locale);
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
        mode="category"
        initialProducts={products}
        categoryId={category.id}
        locale={locale}
        total={total}
        pageSize={pageSize}
      />
    </div>
  );
}
