"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/shared/ui/Button";
import { cn } from "@/shared/lib/cn";
import { useAuthStore } from "../model/auth-store";
import type { AuthDialogTab } from "./AuthDialog";

type AuthHeaderControlsProps = {
  onOpenAuth: (tab: AuthDialogTab) => void;
};

export function AuthHeaderControls({ onOpenAuth }: AuthHeaderControlsProps) {
  const t = useTranslations("auth");
  const tNav = useTranslations("common");
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  /* close on outside click */
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  /* close on Escape */
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  if (user) {
    return (
      <div ref={ref} className="relative hidden md:block">
        {/* user icon trigger */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-haspopup="true"
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full border border-origo-zinc bg-origo-slate/60 text-origo-silver transition-colors hover:border-origo-accent hover:text-origo-white focus:outline-none focus:ring-2 focus:ring-origo-accent",
            open && "border-origo-accent text-origo-white"
          )}
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
          </svg>
        </button>

        {/* dropdown */}
        {open && (
          <div
            className="absolute right-0 top-full z-50 mt-2 w-44 origin-top-right animate-in fade-in slide-in-from-top-1 rounded-lg border border-origo-zinc bg-origo-charcoal py-1 shadow-xl"
            role="menu"
          >
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-sm text-origo-silver transition-colors hover:bg-origo-zinc/60 hover:text-origo-white"
              role="menuitem"
            >
              <svg
                className="h-4 w-4 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
              {tNav("nav.profile")}
            </Link>

            <div className="mx-3 my-1 border-t border-origo-zinc/60" />

            <button
              type="button"
              onClick={() => {
                logout();
                setOpen(false);
              }}
              className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-sm text-origo-silver transition-colors hover:bg-origo-zinc/60 hover:text-origo-white"
              role="menuitem"
            >
              <svg
                className="h-4 w-4 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                />
              </svg>
              {t("logout")}
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      {/* Sign in — временно скрыто
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="hidden border-origo-zinc md:inline-flex"
        onClick={() => onOpenAuth("login")}
      >
        {t("signIn")}
      </Button>
      */}
    </>
  );
}
