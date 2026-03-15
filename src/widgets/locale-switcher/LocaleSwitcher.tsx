"use client";

import { usePathname as useNextPathname } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/shared/lib/cn";

const localeLabels: Record<string, string> = {
  en: "EN",
  ru: "РУС",
  kk: "ҚАЗ",
};

/** Get locale from the real URL pathname (e.g. /en/about -> "en") so active state matches the address bar. */
function getLocaleFromPathname(pathname: string | null): string {
  if (!pathname || pathname === "/") return routing.defaultLocale;
  const segment = pathname.slice(1).split("/")[0] ?? "";
  return (routing.locales as readonly string[]).includes(segment)
    ? segment
    : routing.defaultLocale;
}

/** Strip locale segment from pathname so router.replace doesn't double-prefix. */
function getPathWithoutLocale(pathname: string): string {
  if (!pathname || pathname === "/") return "/";
  for (const loc of routing.locales) {
    const prefix = `/${loc}`;
    if (pathname === prefix) return "/";
    if (pathname.startsWith(prefix + "/")) return pathname.slice(prefix.length) || "/";
  }
  return pathname;
}

export function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const pathWithoutLocale = getPathWithoutLocale(pathname ?? "/");
  const nextPathname = useNextPathname();
  const activeLocale = getLocaleFromPathname(nextPathname);

  return (
    <div
      className="flex items-center gap-0.5 rounded-lg border border-origo-zinc bg-origo-slate/60 p-0.5"
      role="group"
      aria-label="Language"
    >
      {routing.locales.map((loc) => {
        const isActive = activeLocale === loc;
        return (
          <button
            key={loc}
            type="button"
            onClick={() => {
              if (!isActive) router.replace(pathWithoutLocale, { locale: loc });
            }}
            aria-pressed={isActive}
            aria-current={isActive ? "true" : undefined}
            className={cn(
              "relative min-w-[2.25rem] rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors",
              isActive
                ? "bg-origo-accent text-origo-black shadow-sm ring-1 ring-origo-accent/50"
                : "text-origo-silver hover:bg-origo-zinc/50 hover:text-origo-white"
            )}
          >
            {localeLabels[loc] ?? loc}
          </button>
        );
      })}
    </div>
  );
}
