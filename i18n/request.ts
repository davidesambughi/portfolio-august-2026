import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";
import * as rootParams from "next/root-params";
import { routing } from "./routing";

// `locale` is only set when an explicit override is passed to an awaitable
// call (e.g. getTranslations({ locale: 'en' })); otherwise fall back to the
// [locale] root param (next/root-params, stable as of Next.js 16.3 per
// next-intl.dev/blog/nextjs-root-params) so pages stay statically rendered.
export default getRequestConfig(async ({ locale }) => {
  if (!locale) {
    const paramValue = await rootParams.locale();
    if (hasLocale(routing.locales, paramValue)) {
      locale = paramValue;
    } else {
      notFound();
    }
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
