import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { ProductPageEmblaGallery } from "@/widgets/product-page/ui/ProductPageEmblaGallery";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  const assortment = [
    t("assortment.items.actionFigures"),
    t("assortment.items.engineeringModelKits"),
    t("assortment.items.advancedBuildingSets"),
    t("assortment.items.tradingCards"),
  ];

  const approachPoints = [
    t("approach.points.limitedSupply"),
    t("approach.points.curatedAssortment"),
    t("approach.points.directImport"),
    t("approach.points.attentionToDetail"),
  ];

  const partnershipBenefits = [
    t("partnerships.benefits.authenticity"),
    t("partnerships.benefits.quality"),
    t("partnerships.benefits.rareDrops"),
  ];

  const companyCarouselImages = [
    "/images/one.jpg",
    "/images/two.jpg",
    "/images/three.jpg",
  ];

  const factoryCarouselImages = [
    "/images/fac_one.jpg",
    "/images/fac_two.jpg",
    "/images/fac_three.jpg",
    "/images/fac_four.jpg",
    "/images/fac_five.jpg",
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-origo-white sm:text-4xl">
        {t("heading")}
      </h1>

      <section className="mt-6 rounded-2xl border border-origo-zinc bg-origo-charcoal/70 p-6 sm:p-8">
        <p className="text-lg leading-8 text-origo-silver">{t("intro.lead")}</p>
        <p className="mt-4 leading-7 text-origo-silver">{t("intro.body")}</p>

        <div className="mt-6">
          <ProductPageEmblaGallery
            coverImage={companyCarouselImages[0]!}
            gallery={companyCarouselImages}
            productName="Company story"
          />
        </div>
      </section>

      <div className="mt-8 grid gap-6">
        <section className="rounded-2xl border border-origo-zinc bg-origo-charcoal/70 p-6">
          <h2 className="text-xl font-semibold text-origo-white">{t("philosophy.title")}</h2>
          <p className="mt-3 leading-7 text-origo-silver">{t("philosophy.lead")}</p>
          <p className="mt-3 leading-7 text-origo-silver">{t("philosophy.body")}</p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-origo-silver marker:text-origo-white/80">
            <li>{t("philosophy.points.noCopies")}</li>
            <li>{t("philosophy.points.noMassAssortment")}</li>
            <li>{t("philosophy.points.noQuestionableSources")}</li>
          </ul>
          <p className="mt-4 leading-7 text-origo-silver">{t("philosophy.tail")}</p>
          <p className="mt-2 font-medium text-origo-white">{t("philosophy.onlyOriginal")}</p>
        </section>

        <section className="rounded-2xl border border-origo-zinc bg-origo-charcoal/70 p-6">
          <h2 className="text-xl font-semibold text-origo-white">{t("partnerships.title")}</h2>
          <p className="mt-3 leading-7 text-origo-silver">{t("partnerships.body")}</p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-origo-silver marker:text-origo-white/80">
            {partnershipBenefits.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-4 leading-7 text-origo-silver">{t("partnerships.exclusive")}</p>
          <p className="mt-2 leading-7 text-origo-silver">{t("partnerships.access")}</p>

        </section>

        <section className="rounded-2xl border border-origo-zinc bg-origo-charcoal/70 p-6">
          <h2 className="text-xl font-semibold text-origo-white">{t("assortment.title")}</h2>
          <p className="mt-3 leading-7 text-origo-silver">{t("assortment.body")}</p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {assortment.map((item) => (
              <li
                key={item}
                className="rounded-xl border border-origo-zinc bg-origo-charcoal/40 px-4 py-3 text-sm leading-6 text-origo-silver"
              >
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-4 leading-7 text-origo-silver">{t("assortment.tail")}</p>
        </section>

        <section className="rounded-2xl border border-origo-zinc bg-origo-charcoal/70 p-6">
          <h2 className="text-xl font-semibold text-origo-white">{t("approach.title")}</h2>
          <p className="mt-3 leading-7 text-origo-silver">{t("approach.lead")}</p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-origo-silver marker:text-origo-white/80">
            {approachPoints.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-4 leading-7 text-origo-silver">{t("approach.tail")}</p>
        </section>

        <section className="rounded-2xl border border-origo-zinc bg-origo-charcoal/70 p-6">
          <h2 className="text-xl font-semibold text-origo-white">{t("audience.title")}</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-origo-silver marker:text-origo-white/80">
            <li>{t("audience.points.collectors")}</li>
            <li>{t("audience.points.originalSeekers")}</li>
            <li>{t("audience.points.rarityValue")}</li>
            <li>{t("audience.points.authenticityConfidence")}</li>
          </ul>
        </section>
      </div>

      <section className="mt-8 rounded-2xl border border-origo-zinc bg-origo-charcoal/70 p-6 text-center sm:p-8">
        <h2 className="text-xl font-semibold text-origo-white">{t("closing.title")}</h2>
        <p className="mt-4 leading-7 text-origo-silver">{t("closing.line1")}</p>
        <p className="leading-7 text-origo-silver">{t("closing.line2")}</p>
        <p className="leading-7 text-origo-silver">{t("closing.line3")}</p>

        <div className="mx-auto mt-6 max-w-3xl">
          <ProductPageEmblaGallery
            coverImage={factoryCarouselImages[0]!}
            gallery={factoryCarouselImages}
            productName="Factory visit"
          />
        </div>

        <p className="mt-4 text-lg font-semibold tracking-wide text-origo-white">
          {t("closing.tagline")}
        </p>
      </section>
    </div>
  );
}
