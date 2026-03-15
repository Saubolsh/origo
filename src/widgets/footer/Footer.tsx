"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

const footerKeys = [
  { href: "/products", key: "nav.products" as const },
  { href: "/categories", key: "nav.categories" as const },
  { href: "/about", key: "nav.about" as const },
  { href: "/contact", key: "nav.contact" as const },
] as const;

export function Footer() {
  const t = useTranslations("common");

  return (
    <footer className="border-t border-origo-zinc bg-origo-charcoal">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <Link
              href="/"
              className="text-lg font-bold text-origo-white hover:text-origo-accent"
            >
              {t("siteName")}
            </Link>
            <p className="mt-2 max-w-sm text-sm text-origo-muted">
              {t("siteDescription")}
            </p>
          </div>
          <nav className="flex flex-wrap gap-6" aria-label="Footer">
            {footerKeys.map(({ href, key }) => (
              <Link
                key={href}
                href={href}
                className="text-sm text-origo-silver hover:text-origo-white"
              >
                {t(key)}
              </Link>
            ))}
          </nav>
        </div>
        <p className="mt-8 border-t border-origo-zinc pt-8 text-xs text-origo-muted">
          {t("copyright", { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
}
