import Image from "next/image";
import { getTranslations } from "next-intl/server";

export async function Hero() {
  const t = await getTranslations("hero");

  // Every size below is fluid (clamp()) instead of jumping at fixed breakpoints (text-4xl →
  // md:text-5xl → lg:... → xl:...). Discrete breakpoint jumps left gaps where nothing had been
  // tuned for that specific width — e.g. a laptop at 1366x768 landed in a range where the heading
  // was still sized for a wider column than it actually had, wrapped onto an extra line, and
  // pushed the sticky nav below it past the bottom of the viewport. clamp() scales continuously
  // with the viewport, so there's no untested "in-between" size left to break.
  // `justify-center` + `min-h-[calc(...)]`: the padding above is a *minimum* gap, not the thing
  // that fills the viewport. On a tall screen, fixed/clamped padding alone plateaus at its max and
  // leaves the rest of the height empty above the nav (per user feedback, comparing against the
  // mid-fi mockup, where the hero content uses the full height, not just the top of it).
  // `flex-1` (relative to `<main>`) doesn't work for this anymore (2026-08-12): it only had
  // leftover space to grow into back when Hero+Nav were the page's only content (unit 04) — now
  // that Projects/Education/Experience/Skills/About add real content below, the page's total
  // natural height always exceeds the viewport, so `main` never has leftover space to distribute
  // and Hero just renders at its own natural (clamp-capped) size. On very large/wide screens where
  // the clamp()s hit their ceiling, that natural size falls short of the viewport, letting the
  // next section's heading peek in above the fold. An earlier fix wrapped Hero+Nav together in a
  // min-h-dvh div — that broke Nav's `sticky` (its containing block became that ~1-viewport-tall
  // wrapper instead of the full-page `<main>`, so it un-stuck after ~1 viewport of scroll). Fixed
  // properly instead with `min-h-[calc(100svh-var(--nav-height,5.5rem))]`: Hero alone guarantees
  // "one viewport minus Nav's real height", Nav stays a plain sibling of Hero in `<main>` (full-page
  // sticky range preserved), and `--nav-height` is Nav's real measured height (see nav.tsx's
  // ResizeObserver), not a guess — the `5.5rem` fallback only applies for the brief instant before
  // that JS measurement runs (or if JS is unavailable).
  // `svh` not `dvh` (2026-08-12 fix): `dvh` tracks the mobile browser's toolbar live during
  // scroll, so Hero's height (and everything laid out after it, including the sticky Nav right
  // below) kept reflowing mid-scroll as the toolbar animated. On real Android Chrome that
  // reflow, next to a `position: sticky` element, is a documented trigger for the sticky layer
  // desyncing from its correct position until a new layout event (e.g. a scroll reversal) forces
  // a resync — reported as the Nav appearing to scroll away going down, reattaching on the way
  // back up. `svh` (small viewport height, toolbar assumed visible) never changes during scroll,
  // so Hero's height — and the layout around Nav — stays stable through the toolbar animation.
  // Trade-off: once the toolbar hides mid-scroll, Hero no longer grows to fill the newly revealed
  // strip (a small cosmetic gap can appear below Hero in that moment) — accepted in exchange for
  // removing the resize that was disturbing the sticky Nav.
  return (
    <section
      id="hero"
      className="mx-auto flex w-full max-w-[1800px] flex-col justify-center px-[clamp(1.5rem,4vw,6rem)] py-[clamp(2rem,6vh,6rem)] min-h-[calc(100svh-var(--nav-height,5.5rem))]"
    >
      {/* Two columns only from `lg` up: below that there isn't reliably enough room for both a
          readable text column and a real image column side by side — stay stacked (mobile and
          tablet) until `lg`. That single layout switch (row vs column) is a structural decision,
          not something to make fluid; everything else in this section is. */}
      <div className="flex flex-col items-center gap-[clamp(2rem,6vh,3.5rem)] lg:flex-row lg:items-center lg:gap-[clamp(2rem,4vw,4rem)]">
        {/* Text column: centered while stacked (mobile/tablet, per user feedback — the image
            sitting below reads better centered than left-aligned), back to left-aligned once
            two-column at `lg`. `lg:w-[40%]` (image column takes the remaining ~60% via
            `lg:flex-1`) per user-specified 40:60 text:image split — a share of the row rather
            than a fixed pixel value, so the ratio holds at every two-column width. */}
        <div className="flex flex-col items-center gap-[clamp(1rem,2vh,1.25rem)] text-center lg:w-[40%] lg:shrink-0 lg:items-start lg:text-left">
          <h1 className="text-[clamp(1.875rem,1rem+3vw,3.75rem)] font-bold leading-tight text-heading">
            {t("name")}
            <br />
            <span className="text-accent-teal">{t("badge")}</span>
            <br />
            {t("role")}
          </h1>

          <p className="max-w-md text-[clamp(0.95rem,0.4vw+0.85rem,1.125rem)] leading-relaxed text-body">
            {t.rich("body", { br: () => <br /> })}
          </p>
        </div>

        {/* Single composite visual — replaces the earlier 3-block overlapping collage (SDLC
            diagram + undecided placeholder + mobile screenshot) with one pre-composed image
            (SDLC wheel + remoteNIF/project mockups already arranged), per user request.
            Source file (`Screenshot 2026-08-11 200606.png`, 1920x1080) has a large transparent
            margin around the actual composite — `object-contain` on the raw file left most of
            the box empty, reading as "too small" even at full column width. Pre-trimmed via
            `sharp().trim()` to `hero-composite-trimmed.png` (1039x677, tight bounding box of the
            non-transparent content) so the real pixel ratio now matches the visible content and
            fills the box instead of the padding. */}
        <div className="relative aspect-[1039/677] w-full shrink-0 lg:w-auto lg:flex-1" aria-hidden="true">
          <Image
            src="/images/hero-composite-trimmed.png"
            alt=""
            fill
            sizes="(min-width: 1024px) 60vw, 90vw"
            className="object-contain"
          />
        </div>
      </div>
    </section>
  );
}
