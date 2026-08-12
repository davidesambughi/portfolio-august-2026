"use client";

import { createContext, useContext } from "react";

// Shared open/closed state for the five collapsible homepage sections (Projects, Education,
// Experience, Skills, About — see 8c-homepage-mobile-accordion.md). Nav (a sibling component, not
// a descendant of the sections) needs both to read this (bold the matching mobile nav item) and
// write to it (tapping a nav item opens the corresponding section) — a plain prop can't cross that
// sibling boundary, hence a small dedicated context instead of lifting state into a shared parent
// that would also have to re-render on every keystroke-adjacent change.
type MobileAccordionContextValue = {
  openSections: string[];
  setOpenSections: (value: string[]) => void;
};

export const MobileAccordionContext = createContext<MobileAccordionContextValue | null>(null);

// Returns `null` outside a MobileAccordionShell — Nav is also rendered on the Project Detail Page
// (09e), which has no collapsible sections and no shell. Callers fall back to plain link behavior
// when this is `null`, instead of the hook throwing.
export function useMobileAccordion() {
  return useContext(MobileAccordionContext);
}
