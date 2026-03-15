import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { getCategoryBySlug } from "@/entities/category/api";
import { getProductsByCategory } from "@/entities/product/api";
import { ProductGrid } from "@/widgets/product-grid";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const category = await getCategoryBySlug(slug);
  const t = await getTranslations({ locale, namespace: "categories" });
  if (!category) return { title: t("notFound") };
  return {
    title: category.name,
    description: category.description,
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
      <ProductGrid
        products={products}
        className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      />
    </div>
  );
}
