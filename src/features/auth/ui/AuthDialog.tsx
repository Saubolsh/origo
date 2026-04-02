"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/Button";
import { AUTH_USE_MOCK } from "@/shared/config/auth";
import { loginRequest, registerRequest, forgotPasswordRequest } from "../api/auth-api";
import { useAuthStore } from "../model/auth-store";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "required"),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "min6"),
  confirmPassword: z.string().min(1, "required"),
  firstName: z.string().min(1, "required"),
  lastName: z.string().min(1, "required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "passwordMismatch",
  path: ["confirmPassword"],
});

const forgotSchema = z.object({
  email: z.string().email(),
});

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;
type ForgotValues = z.infer<typeof forgotSchema>;

export type AuthDialogTab = "login" | "register";

type AuthDialogView = AuthDialogTab | "forgot";

type AuthDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: AuthDialogTab;
};

const inputClass =
  "w-full rounded-md border border-origo-zinc bg-origo-slate px-3 py-2.5 text-sm text-origo-white placeholder:text-origo-muted focus:border-origo-accent focus:outline-none focus:ring-1 focus:ring-origo-accent";

/* ─── footer links ─── */
function PolicyLinks({ t }: { t: ReturnType<typeof useTranslations<"auth">> }) {
  return (
    <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] leading-relaxed text-origo-muted">
      <a href="/terms" className="transition-colors hover:text-origo-silver">
        {t("termsOfService")}
      </a>
      <a href="/privacy" className="transition-colors hover:text-origo-silver">
        {t("privacyPolicy")}
      </a>
      <a href="/cookies" className="transition-colors hover:text-origo-silver">
        {t("cookiePolicy")}
      </a>
    </div>
  );
}

export function AuthDialog({
  open,
  onOpenChange,
  defaultTab = "login",
}: AuthDialogProps) {
  const t = useTranslations("auth");
  const setSession = useAuthStore((s) => s.setSession);
  const [view, setView] = useState<AuthDialogView>(defaultTab);
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const loginForm = useForm<LoginValues>({
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<RegisterValues>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
    },
  });

  const forgotForm = useForm<ForgotValues>({
    defaultValues: { email: "" },
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [forgotSentEmail, setForgotSentEmail] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (open) {
      setView(defaultTab);
      setError(null);
      setForgotSentEmail(null);
      loginForm.reset();
      registerForm.reset();
      forgotForm.reset();
    }
  }, [open, defaultTab, loginForm, registerForm, forgotForm]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onOpenChange]);

  useEffect(() => {
    if (open && panelRef.current) {
      const el = panelRef.current.querySelector<HTMLElement>(
        'input:not([type="hidden"]), button[type="button"]'
      );
      el?.focus();
    }
  }, [open, view]);

  const mapZodIssue = (issue: z.ZodIssue) => {
    if (issue.code === "too_small" && issue.minimum === 6)
      return t("errors.minPassword");
    if (issue.message === "min6") return t("errors.minPassword");
    if (issue.message === "passwordMismatch") return t("errors.passwordMismatch");
    if (issue.message === "required") return t("errors.required");
    if (issue.code === "invalid_string" && issue.validation === "email")
      return t("errors.email");
    return t("errors.generic");
  };

  const onLogin = loginForm.handleSubmit(async (values) => {
    const parsed = loginSchema.safeParse(values);
    if (!parsed.success) {
      setError(mapZodIssue(parsed.error.issues[0]!));
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const { token, user } = await loginRequest(
        parsed.data.email,
        parsed.data.password
      );
      setSession(token, user);
      onOpenChange(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("errors.generic"));
    } finally {
      setLoading(false);
    }
  });

  const onRegister = registerForm.handleSubmit(async (values) => {
    const parsed = registerSchema.safeParse(values);
    if (!parsed.success) {
      setError(mapZodIssue(parsed.error.issues[0]!));
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const { token, user } = await registerRequest(
        parsed.data.email,
        parsed.data.password,
        parsed.data.firstName,
        parsed.data.lastName
      );
      setSession(token, user);
      onOpenChange(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("errors.generic"));
    } finally {
      setLoading(false);
    }
  });

  const onForgotPassword = forgotForm.handleSubmit(async (values) => {
    const parsed = forgotSchema.safeParse(values);
    if (!parsed.success) {
      setError(mapZodIssue(parsed.error.issues[0]!));
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await forgotPasswordRequest(parsed.data.email);
      setForgotSentEmail(parsed.data.email);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("errors.generic"));
    } finally {
      setLoading(false);
    }
  });

  /* ─── dialog title ─── */
  const dialogTitle =
    view === "forgot"
      ? t("forgotPasswordTitle")
      : view === "login"
        ? t("loginTitle")
        : t("registerTitle");

  const content = (
    <AnimatePresence>
      {open && (
        <motion.div
          key="auth-dialog"
          className="fixed inset-0 z-[110] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div
            role="presentation"
            aria-hidden
            className="absolute inset-0 bg-origo-black/70 backdrop-blur-sm"
            onClick={() => onOpenChange(false)}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal
            aria-labelledby="auth-dialog-title"
            className={cn(
              "relative z-10 w-full max-w-md rounded-lg border border-origo-zinc bg-origo-charcoal p-6 shadow-xl"
            )}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ type: "tween", duration: 0.22, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <h2
                id="auth-dialog-title"
                className="text-lg font-semibold tracking-tight text-origo-white"
              >
                {dialogTitle}
              </h2>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="rounded-lg p-1.5 text-origo-silver hover:bg-origo-zinc hover:text-origo-white focus:outline-none focus:ring-2 focus:ring-origo-accent"
                aria-label={t("close")}
              >
                <svg
                  className="h-5 w-5"
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

            {/* ─── tabs (hidden on forgot view) ─── */}
            {view !== "forgot" && (
              <div className="mt-5 flex rounded-lg border border-origo-zinc bg-origo-slate/40 p-1">
                <button
                  type="button"
                  onClick={() => {
                    setView("login");
                    setError(null);
                  }}
                  className={cn(
                    "flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    view === "login"
                      ? "bg-origo-zinc text-origo-white"
                      : "text-origo-silver hover:text-origo-white"
                  )}
                >
                  {t("tabLogin")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setView("register");
                    setError(null);
                  }}
                  className={cn(
                    "flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    view === "register"
                      ? "bg-origo-zinc text-origo-white"
                      : "text-origo-silver hover:text-origo-white"
                  )}
                >
                  {t("tabRegister")}
                </button>
              </div>
            )}

            {error && (
              <p
                className="mt-4 rounded-md border border-red-900/50 bg-red-950/40 px-3 py-2 text-sm text-red-200"
                role="alert"
              >
                {error}
              </p>
            )}

            {/* ─── LOGIN form ─── */}
            {view === "login" && (
              <form className="mt-5 space-y-4" onSubmit={onLogin} noValidate>
                <div>
                  <label
                    htmlFor="auth-email"
                    className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-origo-muted"
                  >
                    {t("email")}
                  </label>
                  <input
                    id="auth-email"
                    type="email"
                    autoComplete="email"
                    className={inputClass}
                    {...loginForm.register("email")}
                  />
                </div>
                <div>
                  <label
                    htmlFor="auth-password"
                    className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-origo-muted"
                  >
                    {t("password")}
                  </label>
                  <input
                    id="auth-password"
                    type="password"
                    autoComplete="current-password"
                    className={inputClass}
                    {...loginForm.register("password")}
                  />
                </div>

                {/* forgot password link */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setView("forgot");
                      setError(null);
                      setForgotSentEmail(null);
                      forgotForm.reset();
                    }}
                    className="text-xs text-origo-accent transition-colors hover:text-origo-accent/80"
                  >
                    {t("forgotPassword")}
                  </button>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? t("submitting") : t("submitLogin")}
                </Button>

                <PolicyLinks t={t} />
              </form>
            )}

            {/* ─── REGISTER form ─── */}
            {view === "register" && (
              <form
                className="mt-5 space-y-4"
                onSubmit={onRegister}
                noValidate
              >
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="auth-first"
                      className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-origo-muted"
                    >
                      {t("firstName")}
                    </label>
                    <input
                      id="auth-first"
                      type="text"
                      autoComplete="given-name"
                      className={inputClass}
                      {...registerForm.register("firstName")}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="auth-last"
                      className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-origo-muted"
                    >
                      {t("lastName")}
                    </label>
                    <input
                      id="auth-last"
                      type="text"
                      autoComplete="family-name"
                      className={inputClass}
                      {...registerForm.register("lastName")}
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="auth-reg-email"
                    className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-origo-muted"
                  >
                    {t("email")}
                  </label>
                  <input
                    id="auth-reg-email"
                    type="email"
                    autoComplete="email"
                    className={inputClass}
                    {...registerForm.register("email")}
                  />
                </div>
                <div>
                  <label
                    htmlFor="auth-reg-password"
                    className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-origo-muted"
                  >
                    {t("password")}
                  </label>
                  <input
                    id="auth-reg-password"
                    type="password"
                    autoComplete="new-password"
                    className={inputClass}
                    {...registerForm.register("password")}
                  />
                </div>
                <div>
                  <label
                    htmlFor="auth-reg-confirm-password"
                    className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-origo-muted"
                  >
                    {t("confirmPassword")}
                  </label>
                  <input
                    id="auth-reg-confirm-password"
                    type="password"
                    autoComplete="new-password"
                    className={inputClass}
                    {...registerForm.register("confirmPassword")}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? t("submitting") : t("submitRegister")}
                </Button>

                <PolicyLinks t={t} />
              </form>
            )}

            {/* ─── FORGOT PASSWORD view ─── */}
            {view === "forgot" && (
              <div className="mt-5">
                {forgotSentEmail ? (
                  /* ── success state ── */
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-950/50 text-green-400">
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-center text-sm text-origo-silver">
                      {t("forgotPasswordSent", { email: forgotSentEmail })}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setView("login");
                        setError(null);
                        setForgotSentEmail(null);
                      }}
                      className="mx-auto flex items-center gap-1.5 text-sm text-origo-accent transition-colors hover:text-origo-accent/80"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      {t("backToLogin")}
                    </button>
                  </div>
                ) : (
                  /* ── form state ── */
                  <form className="space-y-4" onSubmit={onForgotPassword} noValidate>
                    <p className="text-sm text-origo-silver">
                      {t("forgotPasswordHint")}
                    </p>
                    <div>
                      <label
                        htmlFor="auth-forgot-email"
                        className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-origo-muted"
                      >
                        {t("email")}
                      </label>
                      <input
                        id="auth-forgot-email"
                        type="email"
                        autoComplete="email"
                        className={inputClass}
                        {...forgotForm.register("email")}
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={loading}
                    >
                      {loading ? t("submitting") : t("submitForgotPassword")}
                    </Button>
                    <button
                      type="button"
                      onClick={() => {
                        setView("login");
                        setError(null);
                      }}
                      className="mx-auto flex items-center gap-1.5 text-sm text-origo-accent transition-colors hover:text-origo-accent/80"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      {t("backToLogin")}
                    </button>
                  </form>
                )}

                <PolicyLinks t={t} />
              </div>
            )}

            {AUTH_USE_MOCK && (
              <p className="mt-4 text-center text-xs text-origo-muted">
                {t("mockHint")}
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (!mounted || typeof document === "undefined") return null;
  return createPortal(content, document.body);
}
