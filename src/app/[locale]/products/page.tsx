import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { getProducts } from "@/entities/product/api";
import { ProductGrid } from "@/widgets/product-grid";
import { canonicalUrl } from "@/shared/lib/seo-url";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "products" });

  const canonical = canonicalUrl(locale, "/products/");
  const title = t("title");
  const description = t("description");

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function ProductsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("products");
  const products = await getProducts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-origo-white sm:text-4xl">
        {t("title")}
      </h1>
      <p className="mt-2 text-origo-silver">{t("subtitle")}</p>
      <ProductGrid
        products={products}
        className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      />
    </div>
  );
}
