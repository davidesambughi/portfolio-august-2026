import Image from "next/image";
import { getTranslations } from "next-intl/server";

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
    <section
      id="about"
      className="mx-auto w-full max-w-[1800px] px-[clamp(1.5rem,4vw,6rem)] py-[clamp(3rem,8vh,6rem)]"
    >
      <div className="flex flex-col gap-[clamp(2rem,5vw,4rem)] lg:flex-row">
        <div className="lg:w-[40%] lg:shrink-0">
          <h2 className="text-[clamp(1.5rem,1rem+2vw,2.5rem)] font-bold text-heading">
            {t("heading")}
          </h2>

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
        </div>

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
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[20px]">
            <Image
              src="/images/collage-about.png"
              alt={t("photoAlt")}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 60vw, 100vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
