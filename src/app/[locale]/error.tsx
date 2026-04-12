"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorBoundary({ error, reset }: Props) {
  const t = useTranslations("errors");

  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-lg text-center">
        <h1 className="text-3xl font-bold tracking-tight text-origo-white sm:text-4xl">
          {t("runtimeTitle")}
        </h1>
        <p className="mt-4 text-origo-silver">{t("runtimeDescription")}</p>
        {process.env.NODE_ENV === "development" && (
          <p className="mt-6 break-all text-left font-mono text-xs text-red-300/90">
            {error.message}
            {error.digest ? ` (${error.digest})` : ""}
          </p>
        )}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center rounded-lg border border-origo-zinc bg-origo-slate px-5 py-2.5 text-sm font-medium text-origo-white transition hover:border-origo-accent/50 hover:text-origo-accent"
          >
            {t("tryAgain")}
          </button>
          <Link
            href="/"
            className="inline-flex items-center rounded-lg border border-transparent px-5 py-2.5 text-sm font-medium text-origo-silver underline-offset-4 transition hover:text-origo-accent"
          >
            {t("backHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}
