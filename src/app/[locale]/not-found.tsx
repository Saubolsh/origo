import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("errors");

  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-lg text-center">
        <p className="text-6xl sm:text-7xl font-extrabold text-origo-accent mb-3">404</p>
   
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-origo-white sm:text-4xl">
          {t("notFoundTitle")}
        </h1>
        <p className="mt-4 text-origo-silver">{t("notFoundDescription")}</p>
        <div className="mt-10 flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center rounded-lg border border-origo-zinc bg-origo-slate px-5 py-2.5 text-sm font-medium text-origo-white transition hover:border-origo-accent/50 hover:text-origo-accent"
          >
            {t("backHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}
