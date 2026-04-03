"use client";

import { Link } from "@/i18n/navigation";
import { basePathPrefix } from "@/shared/lib/seo-url";
import { useTranslations } from "next-intl";

const socialLinks = [
  {
    href: "https://wa.me/message/L3HV2HOZQDICP1",
    icon: "/icons/whatsapp-svgrepo-com.svg",
    label: "WhatsApp",
  },
  {
    href: "https://t.me/origo_kz",
    icon: "/icons/telegram-fill-svgrepo-com.svg",
    label: "Telegram",
  },
  {
    href: "https://www.tiktok.com/@origo.kz",
    icon: "/icons/brand-tiktok-sq-svgrepo-com.svg",
    label: "TikTok",
  },
  {
    href: "https://www.youtube.com/@kirr0yal",
    icon: "/icons/youtube-svgrepo-com.svg",
    label: "Youtube",
  },
  {
    href: "https://www.instagram.com/origo.kz/",
    icon: "/icons/instagram-svgrepo-com.svg",
    label: "Instagram",
  },
] as const;

const footerKeys = [
  { href: "/about", key: "nav.about" as const },
  { href: "/contact", key: "nav.contact" as const },
] as const;

const legalDocPaths = [
  {
    path: "/docs/privacy-policy-origo.docx",
    download: "Политика_конфиденциальности_ORIGO.docx",
    labelKey: "footer.privacyPolicy" as const,
  },
  {
    path: "/docs/consent-origo.docx",
    download: "Согласие_ORIGO.docx",
    labelKey: "footer.consentOrigo" as const,
  },
  {
    path: "/docs/public-offer-origo.docx",
    download: "Публичная_оферта_ORIGO.docx",
    labelKey: "footer.publicOffer" as const,
  },
] as const;

export function Footer() {
  const t = useTranslations("common");
  const assetBase = basePathPrefix();

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
            <div className="mt-4 flex items-center gap-2.5">
              {socialLinks.map(({ href, icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-8 w-8 items-center justify-center rounded-full border border-origo-zinc/60 transition-all hover:border-origo-silver hover:bg-origo-zinc/30"
                  aria-label={label}
                >
                  <img
                    src={`${assetBase}${icon}`}
                    alt=""
                    width={16}
                    height={16}
                    className="invert opacity-50 transition-opacity group-hover:opacity-90"
                  />
                </a>
              ))}
            </div>
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

        <div className="mt-8 flex flex-col gap-3 border-t border-origo-zinc pt-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-6">
          <p className="order-2 w-full text-left text-xs text-origo-muted sm:order-1 sm:w-auto">
            {t("copyright", { year: new Date().getFullYear() })}
          </p>
          <nav
            className="order-1 w-full min-w-0 sm:order-2 sm:w-auto"
            aria-label={t("footer.docs")}
          >
            <ul className="flex w-full min-w-0 flex-col items-start gap-y-2 text-xs sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-0 sm:gap-y-1">
              {legalDocPaths.map((doc, index) => (
                <li
                  key={doc.path}
                  className="flex w-full min-w-0 items-center sm:inline-flex sm:w-auto"
                >
                  {index > 0 ? (
                    <span
                      className="mx-2 hidden shrink-0 text-origo-zinc/70 sm:inline"
                      aria-hidden
                    >
                      ·
                    </span>
                  ) : null}
                  <a
                    href={`${assetBase}${doc.path}`}
                    download={doc.download}
                    className="block w-full min-w-0 text-left text-origo-silver/90 underline-offset-2 transition-colors hover:text-origo-white hover:underline sm:inline sm:w-auto"
                  >
                    {t(doc.labelKey)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
