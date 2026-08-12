import { defineRouting } from "next-intl/routing";

// Default locale is English (recruiter-facing site); both locales are always prefixed (/en, /it).
export const routing = defineRouting({
  locales: ["en", "it"],
  defaultLocale: "en",
  localePrefix: "always",
});
