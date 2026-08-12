"use client";

import { Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

// Language names shown in their own endonym (English / Italiano), same in both UI locales —
// not translated, per convention for locale switchers.
const LOCALE_LABELS: Record<(typeof routing.locales)[number], string> = {
  en: "English",
  it: "Italiano",
};

// Base UI's DropdownMenuRadioGroup gives the accessible radio-list semantics (role="menuitemradio",
// arrow-key navigation, single-selection) for free — reused instead of a custom two-button toggle.
export function LanguageSwitcher() {
  const locale = useLocale() as (typeof routing.locales)[number];
  const t = useTranslations("nav");
  const pathname = usePathname();
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t("languageLabel")}
        className="flex h-9 items-center gap-1.5 rounded-full px-3 text-sm text-body transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        <Globe className="size-4" aria-hidden="true" />
        <span className="font-medium uppercase">{locale}</span>
      </DropdownMenuTrigger>
      {/* Explicit pixel radius on the popup + items (2026-08-12): the shared --radius token is
          9999px (sitewide pill style), which every `rounded-*` scale class derives from (see
          globals.css) — so even shadcn's default `rounded-lg`/`rounded-md` render as a full pill
          on a box this small. A dropdown popup isn't a pill-style control, so it's overridden
          locally here rather than in components/ui/dropdown-menu.tsx (keeps the shared primitive's
          defaults intact for any other future use). */}
      <DropdownMenuContent align="end" className="rounded-[10px]">
        <DropdownMenuRadioGroup
          value={locale}
          onValueChange={(value) => {
            router.replace(pathname, { locale: value as (typeof routing.locales)[number] });
          }}
        >
          {routing.locales.map((code) => (
            <DropdownMenuRadioItem key={code} value={code} className="rounded-[6px]">
              {LOCALE_LABELS[code]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
