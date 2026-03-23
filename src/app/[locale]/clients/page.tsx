import { getTranslations, setRequestLocale } from "next-intl/server";
import { canonicalUrl } from "@/shared/lib/seo-url";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "clients" });

  const canonical = canonicalUrl(locale, "/clients/");
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

export default async function ClientsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("clients");

  const sections = [
    { key: "bloggers", title: t("bloggers.title"), text: t("bloggers.text") },
    { key: "streamers", title: t("streamers.title"), text: t("streamers.text") },
    { key: "partners", title: t("partners.title"), text: t("partners.text") },
  ] as const;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-origo-white sm:text-4xl">
        {t("heading")}
      </h1>
      <p className="mt-3 max-w-3xl text-origo-silver">{t("intro")}</p>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {sections.map((section) => (
          <section
            key={section.key}
            className="rounded-2xl border border-origo-zinc bg-origo-charcoal/70 p-6"
          >
            <h2 className="text-xl font-semibold text-origo-white">
              {section.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-origo-silver">
              {section.text}
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}
