import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Accordion } from "@base-ui/react/accordion";
import { ChevronDown } from "lucide-react";

import { AboutAccentBar } from "@/components/about-accent-bar";
import { ScrollReveal } from "@/components/scroll-reveal";

const HEADING_CLASS = "text-[clamp(1.5rem,1rem+2vw,2.5rem)] font-bold text-heading";
const BODY_TEXT_CLASS = "text-[clamp(0.95rem,0.4vw+0.85rem,1.125rem)] leading-relaxed text-body";

// Static, non-interactive: no client component, matches Skills' pattern (see 8a-about-section.md).
// Real copy (2026-08-12): 3 titled subsections (about.section1/2/3.title+body) replacing the
// original 2-paragraph placeholder — "Chi sono"/"About Me" (about.heading) kept as the overarching
// h2 above them (user-confirmed), section titles rendered as h3/text-subheading (the design
// system's existing "sottotitolo" role — ui_context.md — reused rather than inventing a new style).
// Section2 has an extra lead-in sentence + a real bullet list (user-confirmed), the other two
// sections are a single body paragraph.
export async function AboutSection() {
  const t = await getTranslations("about");

  return (
    // Collapsible on mobile (8c) — see 8c-homepage-mobile-accordion.md. Unlike the other four
    // collapsible sections, About's desktop heading is nested one level deep (inside the 40% text
    // column, not full-width above the row), so it can't share a single call site with the mobile
    // trigger the way AccordionSectionHeading does elsewhere — each half is placed independently:
    // the trigger sits above the row (visible even while collapsed), the static desktop <h2> stays
    // exactly where it already was, inside the text column.
    <Accordion.Item
      value="about"
      render={<section id="about" className="w-full bg-black/[0.03]" />}
    >
      <div className="mx-auto w-full max-w-[1800px] px-[clamp(1.5rem,4vw,6rem)] py-[clamp(3rem,8vh,6rem)]">
      <ScrollReveal>
      <Accordion.Header render={<h2 className={`lg:hidden ${HEADING_CLASS}`} />}>
        <Accordion.Trigger className="group flex w-full items-center justify-between gap-3 text-left transition-colors duration-200 hover:text-heading">
          <span>{t("heading")}</span>
          <ChevronDown
            className="size-5 shrink-0 text-body transition-transform duration-200 group-data-[panel-open]:rotate-180"
            aria-hidden="true"
          />
        </Accordion.Trigger>
      </Accordion.Header>
      {/* Accent bar (13a) — same colored-bar-under-heading pattern as AccordionSectionHeading,
          replicated manually here since About uses its own dedicated heading markup instead of
          the shared component (heading is nested inside the 40% text column, not full-width).
          Grows 0 -> 52px (13b) via AboutAccentBar — see that file for why it's a separate client
          component instead of calling useReveal directly here (this file is a Server Component). */}
      <AboutAccentBar className="lg:hidden" />
      </ScrollReveal>

      <Accordion.Panel className="accordion-panel overflow-hidden lg:block lg:overflow-visible lg:[content-visibility:visible]">
      <div className="flex flex-col gap-[clamp(2rem,5vw,4rem)] lg:flex-row">
        {/* Wrapped in ScrollReveal, not the row itself (13b) — this column is a *sibling* of the
            image column below, never an ancestor of its `lg:sticky` element, so animating it with
            `transform` is safe. Wrapping the shared row instead would put a transformed ancestor
            above the sticky image and silently break `position: sticky` (a transform on any
            ancestor changes its containing block). */}
        <ScrollReveal as="div" className="lg:w-[40%] lg:shrink-0">
          <h2 className={`hidden lg:block ${HEADING_CLASS}`}>{t("heading")}</h2>
          <AboutAccentBar className="hidden lg:block" />

          <div className="mt-[clamp(1.5rem,4vw,2.5rem)] flex flex-col gap-[clamp(1.5rem,4vw,2.5rem)]">
            <div>
              <h3 className="text-[clamp(1.05rem,0.5vw+0.95rem,1.375rem)] font-bold text-subheading">
                {t("section1.title")}
              </h3>
              <p className={`mt-[clamp(0.75rem,2vw,1.125rem)] ${BODY_TEXT_CLASS}`}>
                {t("section1.body")}
              </p>
            </div>

            <div>
              <h3 className="text-[clamp(1.05rem,0.5vw+0.95rem,1.375rem)] font-bold text-subheading">
                {t("section2.title")}
              </h3>
              <p className={`mt-[clamp(0.75rem,2vw,1.125rem)] ${BODY_TEXT_CLASS}`}>
                {t("section2.body")}
              </p>
              <p className={`mt-[clamp(0.75rem,2vw,1.125rem)] ${BODY_TEXT_CLASS}`}>
                {t("section2.leadIn")}
              </p>
              <ul
                className={`mt-[clamp(0.5rem,1.5vw,0.75rem)] list-disc space-y-[clamp(0.5rem,1.5vw,0.75rem)] pl-5 ${BODY_TEXT_CLASS}`}
              >
                <li>{t("section2.bullet1")}</li>
                <li>{t("section2.bullet2")}</li>
              </ul>
            </div>

            <div>
              <h3 className="text-[clamp(1.05rem,0.5vw+0.95rem,1.375rem)] font-bold text-subheading">
                {t("section3.title")}
              </h3>
              <p className={`mt-[clamp(0.75rem,2vw,1.125rem)] ${BODY_TEXT_CLASS}`}>
                {t("section3.body")}
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Single real photo collage (public/images/collage-about.png, 1920x1080) replacing the
            3-box placeholder mosaic. Text/image split matched to Hero's 40:60 (lg:w-[40%] text +
            lg:flex-1 image, unit 04). aspect-[16/9] matches the source file's real ratio so
            object-cover never crops (single crop, no multi-segment cropping) — same
            box-matches-image-shape approach as the Hero collage. Native width (1920) is always >=
            the rendered column width at any viewport, so the image never scales up / never pixelates.
            Sticky on desktop only (2026-08-12): once the real 3-section copy made the text column
            much taller than the image, `lg:sticky lg:self-start` pins the image in place while the
            text scrolls past, instead of leaving a large empty gap below a short static image or
            resorting to float. `lg:self-start` keeps the sticky element at its own (short,
            aspect-ratio-driven) height rather than being stretched to the row's full height by the
            flex row's default `align-items: stretch` — the row itself (driven by the taller text
            column) still supplies the scroll runway the sticky image travels within. `lg:top-*`
            offset clears the sticky nav (nav.tsx, `sticky top-0`, ~64-72px tall on desktop) so the
            image doesn't tuck under it; approximate, revisit after a visual pass. Mobile/tablet
            (below `lg`) keeps the original static stacked image, unaffected. */}
        <div className="w-full lg:sticky lg:top-[clamp(4.5rem,9vh,6rem)] lg:w-auto lg:flex-1 lg:self-start">
          {/* Reveal wraps this inner box, not the `lg:sticky` div above — that div must stay
              untransformed (13b, see the text-column comment above for why). This box is a
              *child* of the sticky element, not an ancestor, so a transform here is safe. */}
          <ScrollReveal as="div" className="relative aspect-[16/9] w-full overflow-hidden rounded-[20px] shadow-[0_14px_40px_rgba(0,0,0,.14)]">
            <Image
              src="/images/collage-about.png"
              alt={t("photoAlt")}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 60vw, 100vw"
            />
          </ScrollReveal>
        </div>
      </div>
      </Accordion.Panel>
      </div>
    </Accordion.Item>
  );
}
