import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { getProductBySlug, getProducts } from "@/entities/product/api";
import { ProductPageContent } from "@/widgets/product-page/ProductPageContent";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const product = await getProductBySlug(slug);
  const t = await getTranslations({ locale, namespace: "products" });
  if (!product) return { title: t("notFound") };
  return {
    title: product.name,
    description: product.shortDescription ?? product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return <ProductPageContent product={product} />;
}
