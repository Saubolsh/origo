"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/shared/lib/cn";
import { trackClick } from "@/shared/lib/gtag";
import { useAuthStore, type AuthDialogTab } from "@/features/auth";
import { LocaleSwitcher } from "./LocaleSwitcher";

const navKeys = [
  { href: "/", key: "nav.home" as const },
  { href: "/about", key: "nav.about" as const },
  { href: "/clients", key: "nav.clients" as const },
  { href: "/contact", key: "nav.contact" as const },
] as const;

const OVERLAY_CLOSE_DELAY_MS = 250;

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  onOpenAuth: (tab: AuthDialogTab) => void;
}

export function MobileNav({ open, onClose, onOpenAuth }: MobileNavProps) {
  const t = useTranslations("common");
  const tAuth = useTranslations("auth");
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const allowOverlayCloseRef = useRef(false);
  const delayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [mounted, setMounted] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) {
      allowOverlayCloseRef.current = false;
      if (delayTimerRef.current) {
        clearTimeout(delayTimerRef.current);
        delayTimerRef.current = null;
      }
      return;
    }
    delayTimerRef.current = setTimeout(() => {
      allowOverlayCloseRef.current = true;
      delayTimerRef.current = null;
    }, OVERLAY_CLOSE_DELAY_MS);
    return () => {
      if (delayTimerRef.current) clearTimeout(delayTimerRef.current);
    };
  }, [open]);

  const handleOverlayClick = useCallback(() => {
    if (allowOverlayCloseRef.current) onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open && panelRef.current) {
      const focusable = panelRef.current.querySelector<HTMLElement>(
        'a[href], button:not([disabled])'
      );
      focusable?.focus();
    }
  }, [open]);

  const content = (
    <AnimatePresence>
      {open && (
        <motion.div
          key="mobile-nav"
          className="fixed inset-0 z-[100] md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div
            role="presentation"
            aria-hidden="true"
            className="absolute inset-0 bg-origo-black/60 backdrop-blur-sm"
            onClick={handleOverlayClick}
          />
          <motion.div
            ref={panelRef}
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Main navigation"
            className={cn(
              "absolute right-0 top-0 flex h-full w-full max-w-sm flex-col gap-8 border-l border-origo-zinc bg-origo-charcoal p-6 shadow-xl"
            )}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.25, ease: "easeInOut" }}
          >
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-2 text-origo-silver hover:bg-origo-zinc hover:text-origo-white focus:outline-none focus:ring-2 focus:ring-origo-accent"
                aria-label="Close menu"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <nav className="flex flex-1 flex-col gap-1" aria-label="Main">
              {navKeys.map(({ href, key }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => {
                    trackClick("click_nav", { item: t(key), href, source: "mobile" });
                    onClose();
                  }}
                  aria-current={isActive(href) ? "page" : undefined}
                  className={cn(
                    "rounded-lg border border-transparent px-4 py-3 text-base font-medium text-origo-silver transition hover:bg-origo-zinc hover:text-origo-white",
                    isActive(href) &&
                      "border-origo-accent/40 bg-origo-zinc text-origo-white"
                  )}
                >
                  {t(key)}
                </Link>
              ))}
              {user ? (
                <>
                  <Link
                    href="/profile"
                    onClick={onClose}
                    aria-current={isActive("/profile") ? "page" : undefined}
                    className={cn(
                      "rounded-lg border border-transparent px-4 py-3 text-base font-medium text-origo-silver transition hover:bg-origo-zinc hover:text-origo-white",
                      isActive("/profile") &&
                        "border-origo-accent/40 bg-origo-zinc text-origo-white"
                    )}
                  >
                    {t("nav.profile")}
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      onClose();
                    }}
                    className="rounded-lg border border-transparent px-4 py-3 text-left text-base font-medium text-origo-silver transition hover:bg-origo-zinc hover:text-origo-white"
                  >
                    {tAuth("logout")}
                  </button>
                </>
              ) : (
                <>
                  {/* Sign in — временно скрыто
                  <button
                    type="button"
                    onClick={() => onOpenAuth("login")}
                    className="rounded-lg border border-transparent px-4 py-3 text-left text-base font-medium text-origo-silver transition hover:bg-origo-zinc hover:text-origo-white"
                  >
                    {tAuth("signIn")}
                  </button>
                  */}
                  {/* Регистрация — временно скрыто
                  <button
                    type="button"
                    onClick={() => onOpenAuth("register")}
                    className="rounded-lg border border-transparent px-4 py-3 text-left text-base font-medium text-origo-silver transition hover:bg-origo-zinc hover:text-origo-white"
                  >
                    {tAuth("tabRegister")}
                  </button>
                  */}
                </>
              )}
            </nav>
            <div className="border-t border-origo-zinc pt-6">
              <p className="mb-3 text-xs font-medium uppercase tracking-wide text-origo-muted">
                {t("language")}
              </p>
              <div className="flex justify-start">
                <LocaleSwitcher />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (!mounted || typeof document === "undefined") return null;
  return createPortal(content, document.body);
}
