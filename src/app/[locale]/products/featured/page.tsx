import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { getFeaturedProducts } from "@/entities/product";
import { ProductCatalog } from "@/widgets/product-catalog";
import { canonicalUrl } from "@/shared/lib/seo-url";

export const revalidate = 60;

const FEATURED_PAGE_SIZE = 7;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const tHome = await getTranslations({ locale, namespace: "home" });
  const tProducts = await getTranslations({ locale, namespace: "products" });

  const canonical = canonicalUrl(locale, "/products/featured/");
  const title = tHome("featuredProducts");
  const description = tProducts("featuredSubtitle");

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

export default async function FeaturedProductsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tHome = await getTranslations("home");
  const tProducts = await getTranslations("products");

  const { products, total, pageSize } = await getFeaturedProducts(
    locale,
    1,
    FEATURED_PAGE_SIZE,
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-origo-white sm:text-4xl">
        {tHome("featuredProducts")}
      </h1>
      <p className="mt-2 text-origo-silver">{tProducts("featuredSubtitle")}</p>
      <ProductCatalog
        mode="featured"
        initialProducts={products}
        locale={locale}
        total={total}
        pageSize={pageSize}
      />
    </div>
  );
}
