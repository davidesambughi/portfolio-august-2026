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
}: {
  title: string;
  className?: string;
}) {
  return (
    <>
      <h2 className={cn("hidden lg:block", HEADING_CLASS, className)}>{title}</h2>
      <Accordion.Header render={<h2 className={cn("lg:hidden", HEADING_CLASS, className)} />}>
        <Accordion.Trigger className="group flex w-full items-center justify-between gap-3 text-left transition-colors duration-200 hover:text-heading">
          <span>{title}</span>
          <ChevronDown
            className="size-5 shrink-0 text-body transition-transform duration-200 group-data-[panel-open]:rotate-180"
            aria-hidden="true"
          />
        </Accordion.Trigger>
      </Accordion.Header>
    </>
  );
}
