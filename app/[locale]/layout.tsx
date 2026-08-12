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
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
