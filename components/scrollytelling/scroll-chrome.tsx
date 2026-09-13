"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, useMotionValueEvent, useScroll } from "motion/react";

import { LanguageSwitcher } from "@/components/language-switcher";
import { useIsDesktop } from "@/components/scrollytelling/use-is-desktop";
import { cn } from "@/lib/utils";

// Shared cross-chapter chrome: fixed top progress bar + brand mark/tagline/CTA/
// language-switcher row. One markup, CSS-driven states (fixed-transparent on
// desktop, sticky-black static) — see 16-scrollytelling-hero.md's single-markup
// invariant. Only one <LanguageSwitcher /> instance ever mounts.
export function ScrollChrome() {
  const heroT = useTranslations("hero");
  const chromeT = useTranslations("chrome");
  const { scrollY, scrollYProgress } = useScroll();
  const isDesktop = useIsDesktop();

  const [mounted, setMounted] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  // Starts `true`: Hero sits at the very top of the page on first paint, which
  // is also what static-state visitors (who never run the check below) see
  // permanently, since Hero's own background is black there too.
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Same mount/reduced-motion/breakpoint gate as the Hero chapter's own scroll
  // effects — see the "mount/reduced-motion gate" invariant. Color switching
  // never runs in the static state, so `isDark` stays at its initial `true`
  // there, which is exactly the fixed-white/light static treatment Design asks
  // for — no separate static branch needed.
  const active = mounted && !reduceMotion && isDesktop;

  useMotionValueEvent(scrollY, "change", () => {
    if (!active) return;
    let onDark = false;
    document.querySelectorAll("[data-dossier-dark]").forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top <= 40 && rect.bottom > 40) onDark = true;
    });
    setIsDark(onDark);
  });

  const markColor = isDark ? "var(--color-on-accent)" : "var(--color-heading)";
  const taglineColor = isDark ? "oklch(0.8 0 0)" : "var(--color-accent-teal)";

  return (
    <>
      <motion.div
        className="fixed left-0 top-0 z-[70] hidden h-[3px] w-full origin-left bg-accent-teal min-[820px]:motion-safe:block"
        style={{ scaleX: scrollYProgress }}
      />
      <div
        className={cn(
          "pointer-events-auto sticky top-0 z-50 flex items-center justify-between bg-black px-5 py-3.5",
          "min-[820px]:motion-safe:pointer-events-none min-[820px]:motion-safe:fixed min-[820px]:motion-safe:inset-x-0",
          "min-[820px]:motion-safe:top-0 min-[820px]:motion-safe:z-[60] min-[820px]:motion-safe:bg-transparent",
          "min-[820px]:motion-safe:px-[clamp(20px,4vw,56px)] min-[820px]:motion-safe:py-5"
        )}
      >
        <span
          className="pointer-events-none text-xs font-bold uppercase tracking-[0.14em] transition-colors duration-[400ms] ease-in-out min-[820px]:motion-safe:text-sm"
          style={{ color: markColor }}
        >
          {heroT("name")}
        </span>
        <div className="flex items-center gap-3">
          <span
            className="pointer-events-none text-xs font-medium uppercase tracking-[0.18em] transition-colors duration-[400ms] ease-in-out"
            style={{ color: taglineColor }}
          >
            {chromeT("tagline")}
          </span>
          <a
            href="#contacts"
            className={cn(
              "pointer-events-auto hidden rounded-full px-4 py-2 text-xs font-bold transition-colors min-[820px]:motion-safe:inline-flex",
              isDark ? "bg-white text-black" : "bg-black text-white"
            )}
          >
            {heroT("ctaContact")}
          </a>
          <div className="pointer-events-auto">
            <LanguageSwitcher dark={isDark} />
          </div>
        </div>
      </div>
    </>
  );
}
