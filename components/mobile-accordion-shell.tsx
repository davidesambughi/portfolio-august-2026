"use client";

import { useState } from "react";
import { Accordion } from "@base-ui/react/accordion";

import { MobileAccordionContext } from "@/components/mobile-accordion-context";

// Wraps Nav + the five collapsible homepage sections. `className="contents"` keeps the Root's own
// wrapper element out of layout entirely — the sections rely on normal document flow inside
// <main>, not on being direct flex children of a particular parent, so this div must not
// participate in that flow itself (see 8c-homepage-mobile-accordion.md, Architecture).
//
// `hiddenUntilFound` (not `keepMounted`): Tailwind v4's own Preflight sets
// `[hidden]:where(:not([hidden="until-found"])) { display: none !important; }` — deliberately
// making a plain `hidden=""` attribute un-overridable by any utility class, even with `!`. Using
// `hidden="until-found"` instead (this prop) is explicitly excluded from that rule, so each
// section's Panel can be forced visible at `lg`+ with plain CSS (see each section's Panel
// className) — no matchMedia/JS breakpoint check needed, keeping the site's CSS-only responsive
// convention intact. Verified against the installed @base-ui/react source and Tailwind's compiled
// Preflight output (2026-08-12) before choosing this over a JS-driven `value` override.
export function MobileAccordionShell({ children }: { children: React.ReactNode }) {
  const [openSections, setOpenSections] = useState<string[]>([]);

  return (
    <MobileAccordionContext.Provider value={{ openSections, setOpenSections }}>
      <Accordion.Root
        value={openSections}
        onValueChange={setOpenSections}
        multiple
        hiddenUntilFound
        className="contents"
      >
        {children}
      </Accordion.Root>
    </MobileAccordionContext.Provider>
  );
}
