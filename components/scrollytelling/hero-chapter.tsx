"use client";

import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, useMotionValueEvent, useReducedMotion, useTransform } from "motion/react";

import { useChapterProgress } from "@/components/scrollytelling/use-chapter-progress";
import { useIsDesktop } from "@/components/scrollytelling/use-is-desktop";
import { cn } from "@/lib/utils";

const TEAL = "oklch(0.6149 0.1057 180.86)";
const LIT = "oklch(1 0 0)";
const DIM = "oklch(0 0 0)";

// The Hero chapter: one markup, CSS-driven presentation split (see
// 16-scrollytelling-hero.md's single-markup invariant). `min-[820px]:motion-safe:`
// stacked variants express every layout/typography/position difference between
// the pinned/animated desktop state and the static state (narrow viewport OR
// prefers-reduced-motion) — pure CSS, resolved identically on server and
// client, no hydration risk. Only the scroll-progress-driven numeric effects
// (image transform, hint opacity, word colors) are gated in JS by `active`,
// since those can't be expressed in CSS and must render their static-safe
// default before the client has mounted.
export function HeroChapter() {
  const t = useTranslations("hero");
  const chromeT = useTranslations("chrome");
  const sectionRef = useRef<HTMLElement>(null);
  const p = useChapterProgress(sectionRef);

  const reduceMotion = useReducedMotion(); // true = user prefers reduced motion
  const isDesktop = useIsDesktop();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Mount/reduced-motion/breakpoint gate: `useReducedMotion()` isn't safe to
  // trust before `mounted` (it can already reflect the real device
  // preference on the very first client render, ahead of what SSR emitted) —
  // so scroll-driven effects wait for all three.
  const active = mounted && !reduceMotion && isDesktop;

  const imageTransform = useTransform(p, (latest) =>
    active ? `scale(${1.12 + latest * 0.16}) translate3d(0, ${-latest * 30}px, 0)` : undefined
  );
  const hintOpacity = useTransform(p, (latest) =>
    active ? Math.min(Math.max(1 - latest * 8, 0), 1) : 1
  );

  // `hero.body` carries one literal "\n" between the descriptive sentence and
  // the closing adjective triplet (e.g. "Fast. Precise. Repeatable."), which
  // must always land on its own line rather than wrap naturally — everything
  // else about the paragraph (word count, wrapping within each line) still
  // tolerates the ±30% length variance the content-as-data rule asks for.
  const bodyText = t("body");
  const lines = useMemo(() => bodyText.split("\n"), [bodyText]);
  // The closing adjective line (e.g. "Fast. Precise. Repeatable.") is styled
  // like the eyebrow badge — teal, italic, always — so it never progresses to
  // the white "fully lit" stage the rest of the paragraph does; it only ever
  // reveals from invisible straight to teal.
  const lastLineIndex = lines.length - 1;
  const words = useMemo(
    () =>
      lines.flatMap((line, li) =>
        line
          .trim()
          .split(/\s+/)
          .filter(Boolean)
          .map((word) => ({ word, isAdjective: li === lastLineIndex }))
      ),
    [lines, lastLineIndex]
  );
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const applyWordColors = useCallback(
    (latest: number) => {
      const n = words.length;
      const head = Math.min(Math.max(latest * 1.3, 0), 1.3) * n;
      wordRefs.current.forEach((el, i) => {
        if (!el) return;
        const d = head - i;
        el.style.color = words[i].isAdjective ? (d > 0 ? TEAL : DIM) : d > 0.7 ? LIT : d > 0 ? TEAL : DIM;
      });
    },
    [words]
  );

  useMotionValueEvent(p, "change", (latest) => {
    if (active) applyWordColors(latest);
  });

  // Applies once when `active` turns on (a scroll "change" event won't fire on
  // its own if the page is already at p=0), and clears the inline override if
  // `active` turns back off (e.g. viewport resized below 820px), letting the
  // CSS static color take over again.
  useEffect(() => {
    if (active) {
      applyWordColors(p.get());
    } else {
      wordRefs.current.forEach((el) => {
        if (el) el.style.color = "";
      });
    }
  }, [active, applyWordColors, p]);

  const [firstName, ...restName] = t("name").split(" ");
  const lastName = restName.join(" ");

  return (
    <section
      ref={sectionRef}
      id="hero"
      data-dossier-dark
      className="relative h-auto bg-black min-[820px]:motion-safe:h-[300vh]"
    >
      <div className="relative flex h-auto flex-col min-[820px]:motion-safe:sticky min-[820px]:motion-safe:top-0 min-[820px]:motion-safe:h-dvh min-[820px]:motion-safe:items-center min-[820px]:motion-safe:justify-center min-[820px]:motion-safe:overflow-hidden">
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute right-[-28%] top-[8%] w-[110%] opacity-20 will-change-transform min-[820px]:motion-safe:right-[-6%] min-[820px]:motion-safe:top-1/2 min-[820px]:motion-safe:w-[70%] min-[820px]:motion-safe:max-w-[1000px] min-[820px]:motion-safe:opacity-[0.22] min-[820px]:motion-safe:[transform-origin:70%_50%] min-[820px]:motion-safe:[translate:0_-50%]"
          style={{ transform: imageTransform }}
        >
          <Image
            src="/images/hero-composite-trimmed.png"
            alt=""
            width={1039}
            height={677}
            className="h-auto w-full"
            priority
          />
        </motion.div>

        <div className="absolute inset-0 bg-[linear-gradient(to_top,black_22%,rgba(0,0,0,.7))] min-[820px]:motion-safe:bg-[linear-gradient(to_right,black_30%,rgba(0,0,0,.75)_62%,rgba(0,0,0,.4))]" />

        <div className="relative z-[2] flex w-full flex-col gap-[clamp(18px,3vh,34px)] px-5 pb-[44px] pt-[56px] min-[820px]:motion-safe:px-[clamp(28px,7vw,120px)] min-[820px]:motion-safe:py-0">
          <span className="text-xs font-bold uppercase tracking-[0.26em] text-accent-teal">
            {t("badge")} · {t("role")}
          </span>

          <h1 className="text-[52px] font-extrabold leading-[0.88] text-on-accent min-[820px]:motion-safe:text-[clamp(44px,9.5vw,178px)] min-[820px]:motion-safe:leading-[0.86] min-[820px]:motion-safe:tracking-[-0.045em]">
            {firstName}
            <br />
            {lastName}
          </h1>

          <p className="max-w-[34ch] text-[oklch(0.85_0_0)] text-[clamp(16px,1.5vw,26px)] font-medium leading-[1.5] min-[820px]:motion-safe:text-on-accent">
            {(() => {
              let wordIndex = 0;
              return lines.map((line, li) => {
                const lineWords = line.trim().split(/\s+/).filter(Boolean);
                const isAdjectiveLine = li === lastLineIndex;
                return (
                  <Fragment key={li}>
                    {lineWords.map((word) => {
                      const i = wordIndex++;
                      return (
                        <span
                          key={i}
                          ref={(el) => {
                            wordRefs.current[i] = el;
                          }}
                          className={cn(
                            "transition-colors duration-[350ms] [transition-timing-function:ease]",
                            isAdjectiveLine && "italic text-accent-teal"
                          )}
                        >
                          {word}{" "}
                        </span>
                      );
                    })}
                    {li < lines.length - 1 && <br />}
                  </Fragment>
                );
              });
            })()}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#contacts"
              className="inline-flex min-h-[48px] items-center rounded-full bg-white px-[22px] py-[14px] text-[15px] font-bold text-black"
            >
              {t("ctaContact")}
            </a>
            <a
              href="#projects"
              className="inline-flex min-h-[48px] items-center rounded-full border-[1.5px] border-white/35 px-[22px] py-[14px] text-[15px] font-bold text-white min-[820px]:motion-safe:hidden"
            >
              {t("ctaProjects")}
            </a>
          </div>
        </div>

        <motion.div
          className={cn(
            "pointer-events-none absolute bottom-[30px] left-1/2 hidden -translate-x-1/2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[oklch(0.7_0_0)]",
            "min-[820px]:motion-safe:block"
          )}
          style={{ opacity: hintOpacity }}
        >
          {chromeT("scrollHint")}
        </motion.div>
      </div>
    </section>
  );
}
