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
        <p>
          {t.rich("line1", {
            telegram: (chunks) => (
              <a
                href="https://t.me/origo_kz?direct"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-origo-white underline underline-offset-4"
              >
                {chunks}
              </a>
            ),
          })}
        </p>
        <p>{t("line2")}</p>
        <p className="font-medium text-origo-white">
          {t.rich("line3", {
            telegram: (chunks) => (
              <a
                href="https://t.me/origo_kz?direct"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4"
              >
                {chunks}
              </a>
            ),
          })}
        </p>
        <p>{t("line4")}</p>
        <p className="font-medium text-origo-white">{t("line5")}</p>
        <p>{t("line6")}</p>
        <p className="text-sm text-origo-muted">{t("line7")}</p>
      </div>
      {/* <div className="mt-8 rounded-lg border border-origo-zinc bg-origo-slate p-6">
        <p className="text-sm text-origo-muted">{t("formNote")}</p>
      </div> */}
    </div>
  );
}
