import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-origo-white sm:text-4xl">
        {t("heading")}
      </h1>
      <div className="mt-6 space-y-4 text-origo-silver">
        <p>{t("line1")}</p>
        <p>{t("line2")}</p>
        <p className="font-medium text-origo-white">{t("line3")}</p>
        <p>{t("line4")}</p>
        <p className="font-medium text-origo-white">{t("line5")}</p>
        <p>{t("line6")}</p>
        <p className="text-sm text-origo-muted">{t("line7")}</p>
        <p className="py-2 text-center text-origo-muted">{t("separator")}</p>
        <p>{t("premiumLead")}</p>
        <h2 className="text-2xl font-semibold tracking-tight text-origo-white sm:text-3xl">
          {t("premiumHeading")}
        </h2>
        <p>{t("premiumLine1")}</p>
        <p>{t("premiumLine2")}</p>
        <p className="font-medium text-origo-white">{t("premiumLine3")}</p>
        <p className="text-sm text-origo-muted">{t("premiumLine4")}</p>
      </div>
      {/* <div className="mt-8 rounded-lg border border-origo-zinc bg-origo-slate p-6">
        <p className="text-sm text-origo-muted">{t("formNote")}</p>
      </div> */}
    </div>
  );
}
