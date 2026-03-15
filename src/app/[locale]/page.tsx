import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getCategories } from "@/entities/category/api";
import { getProducts } from "@/entities/product/api";
import { CategoryGrid } from "@/widgets/category-grid";
import { ProductGrid } from "@/widgets/product-grid";

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);
  const featuredProducts = products.slice(0, 6);

  const t = await getTranslations("home");
  const tCommon = await getTranslations("common");

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-origo-white sm:text-5xl">
          {t("title")}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-origo-silver">
          {t("subtitle")}
        </p>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-semibold text-origo-white">
          {t("shopByCategory")}
        </h2>
        <CategoryGrid
          categories={categories}
          className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        />
        <div className="mt-8 text-center">
          <Link
            href="/categories"
            className="text-origo-accent hover:underline"
          >
            {tCommon("viewAllCategories")}
          </Link>
        </div>
      </section>

      <section className="mt-20">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-origo-white">
            {t("featuredProducts")}
          </h2>
          <Link
            href="/products"
            className="text-origo-accent hover:underline"
          >
            {tCommon("viewAll")}
          </Link>
        </div>
        <ProductGrid
          products={featuredProducts}
          className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        />
      </section>
    </div>
  );
}
