import type { Metadata, Viewport } from "next";
import { hasLocale } from "next-intl";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Google_Sans_Flex } from "next/font/google";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { routing } from "@/i18n/routing";
import "../globals.css";

const googleSansFlex = Google_Sans_Flex({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Davide Sambughi — Full Stack Developer",
  description:
    "Portfolio of Davide Sambughi, Full Stack Developer — projects, experience, and education.",
};

// Next.js's own auto-generated default only emits `width=device-width` (verified via curl
// against this project's rendered HTML) — missing `initial-scale=1` despite the framework docs
// claiming the default is "sufficient". Without initial-scale, mobile browsers can't establish a
// 1:1 CSS-pixel/device-pixel relationship and guess an initial zoom, which is the textbook cause
// of the horizontal overflow (white gutter + horizontal scrollbar) seen on real mobile devices.
// `maximumScale`/`userScalable` deliberately omitted — Next's own "recommended" full default
// includes `user-scalable=no`, which is a WCAG 1.4.4 violation (blocks pinch-zoom) and conflicts
// with this project's accessibility goals (ui_context.md).
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

// Prerenders both locales at build time (static site, no server runtime).
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${googleSansFlex.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        {/* Vercel Web Analytics — route-aware wrapper around the tracking script;
            no-ops locally and only sends data from deployed environments. */}
        <Analytics />
      </body>
    </html>
  );
}
