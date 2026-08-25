import { getLocale, getTranslations } from "next-intl/server";
import { Accordion } from "@base-ui/react/accordion";

import { AccordionSectionHeading } from "@/components/accordion-section-heading";
import { ExperienceTimeline } from "@/components/experience-timeline";
import { ScrollReveal } from "@/components/scroll-reveal";
import { formatDateRange } from "@/lib/format-date";
import { getExperience } from "@/lib/content";
import type { TimelineNode } from "@/components/experience-timeline";

// Job-title marker dots alternate by chronological position (oldest first), cycling through
// repeats — computed once here so the same entry gets the same color on both the desktop timeline
// and the mobile vertical timeline, even though the two layouts display entries in different
// orders (chronological vs. most-recent-first).
const DOT_CLASSES = ["bg-accent-blue", "bg-accent-yellow", "bg-accent-green", "bg-accent-red"] as const;

// Soft per-color hover tint (2026-08-12), matching each entry's own marker dot color, instead of
// a flat neutral hover — replaces the old `group-hover:bg-muted`, which became invisible once
// Experience's section background changed to bg-black/[0.03] (near-identical lightness to
// --muted). Opacity is tuned per color, not uniform: yellow (very light, high lightness) needs a
// much stronger tint than blue/green/red to read as a visible hover at all.
const HOVER_CLASSES = [
  "group-hover:bg-accent-blue/10",
  "group-hover:bg-accent-yellow/25",
  "group-hover:bg-accent-green/12",
  "group-hover:bg-accent-red/10",
] as const;

export async function ExperienceSection() {
  const t = await getTranslations("experience");
  const locale = (await getLocale()) as "en" | "it";
  const experience = getExperience();

  // Desktop timeline reads left-to-right chronologically (oldest -> most recent). Mobile is now
  // also a timeline graphic (not a plain list) but keeps the CV-convention most-recent-first
  // order — per user decision, the two layouts intentionally read in opposite directions.
  const chronological = [...experience].reverse();
  const colorIndexById = new Map(chronological.map((entry, index) => [entry.id, index % DOT_CLASSES.length]));
  colorIndexById.set("future", chronological.length % DOT_CLASSES.length);

  const toNode = (entry: (typeof experience)[number]): TimelineNode => {
    const colorIndex = colorIndexById.get(entry.id) ?? 0;
    return {
      id: entry.id,
      title: entry.role[locale],
      subtitle: [entry.company, entry.location].filter(Boolean).join(", "),
      dateRange: formatDateRange(entry.startDate, entry.endDate, t("present"), locale),
      description: entry.description[locale],
      isFuture: false,
      dotColorClass: DOT_CLASSES[colorIndex],
      hoverBgClass: HOVER_CLASSES[colorIndex],
    };
  };

  const futureColorIndex = colorIndexById.get("future") ?? 0;
  const futureNode: TimelineNode = {
    id: "future",
    title: t("futureTitle"),
    subtitle: t("futureSubtitle"),
    dateRange: null,
    description: null,
    isFuture: true,
    dotColorClass: DOT_CLASSES[futureColorIndex],
    hoverBgClass: HOVER_CLASSES[futureColorIndex],
  };

  const desktopNodes: TimelineNode[] = [...chronological.map(toNode), futureNode];
  // Future placed first: mobile reads most-recent-first (newest at top), and "Future" sits beyond
  // even the newest real entry chronologically, so it belongs above it, not at the list's end.
  // Assistant's call, not explicitly specified — flag if a different position was intended.
  const mobileNodes: TimelineNode[] = [futureNode, ...experience.map(toNode)];

  return (
    // Full-bleed background test (2026-08-12, matching Footer's bg-black/[0.03]) — same
    // outer-bg/inner-max-w two-layer structure as Projects and footer.tsx. Collapsible on mobile
    // (8c) — see 8c-homepage-mobile-accordion.md.
    <Accordion.Item
      value="experience"
      render={<section id="experience" className="w-full bg-accent-purple/[0.04]" />}
    >
      <div className="mx-auto w-full max-w-[1800px] px-[clamp(1.5rem,4vw,6rem)] py-[clamp(1.5rem,4vh,3rem)]">
        <ScrollReveal>
          <AccordionSectionHeading title={t("heading")} barColorClass="bg-accent-purple" barAlign="start" />
        </ScrollReveal>

        <Accordion.Panel className="accordion-panel overflow-hidden lg:block lg:overflow-visible lg:[content-visibility:visible]">
          <ExperienceTimeline desktopNodes={desktopNodes} mobileNodes={mobileNodes} />
        </Accordion.Panel>
      </div>
    </Accordion.Item>
  );
}
