"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/shared/lib/cn";
import { LocaleSwitcher } from "@/widgets/locale-switcher";
import { MobileNav } from "./MobileNav";

const navKeys = [
  { href: "/", key: "nav.home" as const },
  { href: "/about", key: "nav.about" as const },
  { href: "/contact", key: "nav.contact" as const },
] as const;

const MOBILE_NAV_ID = "mobile-nav";

export function Header() {
  const t = useTranslations("common");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-origo-zinc bg-origo-black/90 backdrop-blur supports-[backdrop-filter]:bg-origo-black/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-origo-white hover:text-origo-accent"
        >
          {t("siteName")}
        </Link>

        {/* Desktop nav: visible from md */}
        <nav
          className="hidden items-center gap-6 md:flex"
          aria-label="Main"
        >
          {navKeys.map(({ href, key }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "text-sm font-medium text-origo-silver transition hover:text-origo-white",
                href === "/" && "text-origo-white"
              )}
            >
              {t(key)}
            </Link>
          ))}
          <LocaleSwitcher />
        </nav>

        {/* Mobile: burger button (toggle when menu is open) */}
        <button
          type="button"
          className="rounded-lg p-2 text-origo-silver hover:bg-origo-zinc hover:text-origo-white focus:outline-none focus:ring-2 focus:ring-origo-accent md:hidden"
          aria-expanded={menuOpen}
          aria-controls={MOBILE_NAV_ID}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
