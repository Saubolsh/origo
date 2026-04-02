"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { AUTH_USE_MOCK } from "@/shared/config/auth";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/Button";
import { useAuthStore } from "../model/auth-store";
import type { AuthDialogTab } from "./AuthDialog";

type ProfilePanelProps = {
  onOpenAuth: (tab: AuthDialogTab) => void;
};

export function ProfilePanel({ onOpenAuth }: ProfilePanelProps) {
  const t = useTranslations("profile");
  const tAuth = useTranslations("auth");
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const logout = useAuthStore((s) => s.logout);

  if (!user || !token) {
    return (
      <div className="mx-auto max-w-lg px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-origo-white sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-4 text-origo-silver">{t("guestIntro")}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button type="button" size="lg" onClick={() => onOpenAuth("login")}>
            {tAuth("submitLogin")}
          </Button>
          {/* Регистрация — временно скрыто
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => onOpenAuth("register")}
          >
            {tAuth("tabRegister")}
          </Button>
          */}
        </div>
      </div>
    );
  }

  const tokenPreview =
    token.length > 48 ? `${token.slice(0, 24)}…${token.slice(-12)}` : token;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-origo-white sm:text-4xl">
        {t("title")}
      </h1>
      <p className="mt-2 text-sm text-origo-muted">{t("subtitle")}</p>

      <div className="mt-8 rounded-lg border border-origo-zinc bg-origo-slate p-6">
        <dl className="space-y-4">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-origo-muted">
              {t("name")}
            </dt>
            <dd className="mt-1 text-origo-white">
              {[user.firstName, user.lastName].filter(Boolean).join(" ") ||
                "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-origo-muted">
              {tAuth("email")}
            </dt>
            <dd className="mt-1 text-origo-white">{user.email}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-origo-muted">
              {t("tokenLabel")}
            </dt>
            <dd className="mt-1 break-all font-mono text-xs text-origo-silver">
              {tokenPreview}
            </dd>
          </div>
        </dl>

        {AUTH_USE_MOCK && (
          <p className="mt-4 rounded-md border border-origo-accent/30 bg-origo-charcoal px-3 py-2 text-xs text-origo-silver">
            {t("mockBadge")}
          </p>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <Button type="button" variant="secondary" onClick={() => logout()}>
            {t("logout")}
          </Button>
          <Link
            href="/"
            className={cn(
              "inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium text-origo-silver transition-colors hover:bg-origo-zinc/30 hover:text-origo-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-origo-accent"
            )}
          >
            {t("backHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}
