import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Google_Sans_Flex } from "next/font/google";
import { notFound } from "next/navigation";
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
        {/* Invisible, inert `position: fixed` anchor — not decorative, don't remove. On Android
            Chrome, `position: sticky` elements (see nav.tsx) can desync from their correct
            position while the mobile toolbar animates during scroll, only resyncing on a new
            layout event (e.g. a scroll-direction reversal). A documented workaround is keeping
            at least one `fixed` element present in the page, which keeps Chrome's internal
            tracking for fixed/sticky layers active through the toolbar's resize. Global here
            (not just the homepage) so it also covers the Project Detail Page's sticky TOC tab. */}
        <div aria-hidden="true" className="fixed inset-0 -z-10 pointer-events-none" />
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
