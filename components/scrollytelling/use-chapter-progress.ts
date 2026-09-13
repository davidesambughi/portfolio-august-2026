"use client";

import type { RefObject } from "react";
import { useScroll, type MotionValue } from "motion/react";

// Shared by every scrollytelling chapter: tracks one chapter's own 0->1 scroll
// progress as its <section> track moves through the viewport ("start start" to
// "end end" — 0 when the track's top hits the viewport top, 1 when its bottom
// hits the viewport bottom). Kept generic on purpose — no Hero-specific logic
// here, every future chapter reuses this same hook.
export function useChapterProgress(ref: RefObject<HTMLElement | null>): MotionValue<number> {
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  return scrollYProgress;
}
