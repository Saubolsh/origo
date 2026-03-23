import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ru", "kz"],
  defaultLocale: "ru",
  localePrefix: "always",
});
