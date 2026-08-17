"use client";

import { Accordion } from "@base-ui/react/accordion";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

const HEADING_CLASS = "text-[clamp(1.5rem,1rem+2vw,2.5rem)] font-bold text-heading";

// Renders the section's heading twice, toggled by the `lg` breakpoint (same "both always render
// server-side, CSS-toggled" pattern as Experience's desktop/mobile timeline split, unit 07):
// - Desktop (`lg`+): the plain, non-interactive `<h2>` — today's exact markup, unchanged.
// - Mobile (below `lg`): the same text + a chevron, wrapped in `Accordion.Trigger` so the whole
//   row is the tap target that expands/collapses the section (see 8c-homepage-mobile-accordion.md).
// `Accordion.Header` renders an `<h3>` by default (confirmed against the installed package's own
// source) — `render={<h2 />}` is required so both renders share the same heading level.
export function AccordionSectionHeading({
  title,
  className,
  barColorClass,
  barAlign = "center",
}: {
  title: string;
  className?: string;
  /** Optional decorative accent bar rendered below the heading (13a). Omitted entirely when not passed. */
  barColorClass?: string;
  barAlign?: "center" | "start";
}) {
  // `visibility` must always include an explicit "block" alongside the breakpoint toggle — a bare
  // `<span>` is `display: inline` by default, which silently ignores `w-`/`h-` (the bug this fixed,
  // 2026-08-17: the mobile variant only had "lg:hidden" with no "block", so the bar rendered with
  // zero size on every section except About, whose bar was written by hand with "block" included).
  const baseBar = "mt-[14px] h-[5px] w-[52px] rounded-full";
  // Desktop bar respects `barAlign` (centered under a centered heading, or left under a
  // left-aligned one). Mobile's `Accordion.Trigger` row is always a left-aligned "text — chevron"
  // layout regardless of the desktop heading's own alignment (pre-existing pattern, 8c) — so the
  // mobile bar must always sit left too, never centered via `mx-auto`, or it visually detaches from
  // the now-left-aligned trigger text above it (bug reported 2026-08-17, same session as the fix above).
  const desktopBarClass = cn(
    "hidden lg:block",
    baseBar,
    barColorClass,
    barAlign === "center" && "mx-auto"
  );
  const mobileBarClass = cn("block lg:hidden", baseBar, barColorClass);

  return (
    <>
      <h2 className={cn("hidden lg:block", HEADING_CLASS, className)}>{title}</h2>
      {barColorClass && <span className={desktopBarClass} aria-hidden="true" />}
      <Accordion.Header render={<h2 className={cn("lg:hidden", HEADING_CLASS, className)} />}>
        <Accordion.Trigger className="group flex w-full items-center justify-between gap-3 text-left transition-colors duration-200 hover:text-heading">
          <span>{title}</span>
          <ChevronDown
            className="size-5 shrink-0 text-body transition-transform duration-200 group-data-[panel-open]:rotate-180"
            aria-hidden="true"
          />
        </Accordion.Trigger>
      </Accordion.Header>
      {barColorClass && <span className={mobileBarClass} aria-hidden="true" />}
    </>
  );
}
