import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { getProductBySlug, getAllProductSlugs } from "@/entities/product";
import { ProductPageContent } from "@/widgets/product-page";
import { canonicalUrl } from "@/shared/lib/seo-url";

export const revalidate = 60;

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const product = await getProductBySlug(slug, locale);
  const t = await getTranslations({ locale, namespace: "products" });
  if (!product) return { title: t("notFound") };

  const canonical = canonicalUrl(locale, `/products/${product.slug}/`);
  const title = product.name;
  const description = product.shortDescription ?? product.description;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      // Next.js validates `openGraph.type` against an allowlist.
      // `"product"` is not accepted here, so use a safe default.
      type: "website",
      // Use plain URLs for maximum compatibility with Next's Metadata API.
      images: [product.coverImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [product.coverImage],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const product = await getProductBySlug(slug, locale);
  if (!product) notFound();

  const canonical = canonicalUrl(locale, `/products/${product.slug}/`);

  const availabilityUrl =
    product.availability === "in-stock"
      ? "https://schema.org/InStock"
      : product.availability === "preorder"
        ? "https://schema.org/PreOrder"
        : "https://schema.org/OutOfStock";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription ?? product.description,
    sku: product.sku,
    image: [product.coverImage],
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: product.currency,
      price: product.price,
      availability: availabilityUrl,
      url: canonical,
    },
  };

  return (
    <>
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      <ProductPageContent product={product} />
    </>
  );
}
