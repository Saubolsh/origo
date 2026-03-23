import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { getCategories, getCategoryBySlug } from "@/entities/category/api";
import { getProductsByCategory } from "@/entities/product/api";
import { ProductCatalog } from "@/widgets/product-catalog";
import { canonicalUrl } from "@/shared/lib/seo-url";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const category = await getCategoryBySlug(slug);
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

  const [category, products] = await Promise.all([
    getCategoryBySlug(slug),
    getCategoryBySlug(slug).then((c) =>
      c ? getProductsByCategory(c.id) : []
    ),
  ]);

  if (!category) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-origo-white">
        {category.name}
      </h1>
      {category.description && (
        <p className="mt-2 text-origo-silver">{category.description}</p>
      )}
      <ProductCatalog products={products} />
    </div>
  );
}

