"use client";

import { useEffect, useMemo, useState } from "react";
import "@/shared/styles/globals.css";
import { routing } from "@/i18n/routing";

const COPY = {
  en: {
    title: "Something went wrong",
    description: "Please try again or return to the home page.",
    tryAgain: "Try again",
    home: "Back to home",
  },
  ru: {
    title: "Что-то пошло не так",
    description: "Попробуйте снова или вернитесь на главную.",
    tryAgain: "Попробовать снова",
    home: "На главную",
  },
  kz: {
    title: "Бірдеңе дұрыс болмады",
    description: "Қайта көріңіз немесе басты бетке оралыңыз.",
    tryAgain: "Қайталау",
    home: "Басты бетке",
  },
} as const;

type LocaleKey = keyof typeof COPY;

function localeFromPath(pathname: string): LocaleKey {
  const m = pathname.match(/^\/(en|ru|kz)(?:\/|$)/);
  const key = m?.[1];
  if (key === "en" || key === "ru" || key === "kz") return key;
  return routing.defaultLocale as LocaleKey;
}

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: Props) {
  const basePath = useMemo(
    () => (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, ""),
    [],
  );

  const [locale, setLocale] = useState<LocaleKey>(
    routing.defaultLocale as LocaleKey,
  );

  useEffect(() => {
    setLocale(localeFromPath(window.location.pathname));
  }, []);

  const t = COPY[locale];
  const homeHref = `${basePath}/${locale}/`;

  return (
    <html lang={locale}>
      <body>
        <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-origo-white sm:text-3xl">
            {t.title}
          </h1>
          <p className="mt-4 text-origo-silver">{t.description}</p>
          {process.env.NODE_ENV === "development" && (
            <p className="mt-6 max-w-full break-all font-mono text-xs text-red-300/90">
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
              {t.tryAgain}
            </button>
            <a
              href={homeHref}
              className="inline-flex items-center rounded-lg border border-transparent px-5 py-2.5 text-sm font-medium text-origo-silver underline-offset-4 transition hover:text-origo-accent"
            >
              {t.home}
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
