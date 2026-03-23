import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

import enMessages from "../../messages/en.json";
import ruMessages from "../../messages/ru.json";
import kzMessages from "../../messages/kz.json";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    // Static mapping prevents bundler/runtime issues with dynamic JSON imports
    // during `output: "export"` prerendering.
    messages:
      locale === "en"
        ? enMessages
        : locale === "ru"
          ? ruMessages
          : kzMessages,
  };
});
