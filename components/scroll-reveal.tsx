"use client";

import type { ReactNode, Ref } from "react";

import { cn } from "@/lib/utils";
import { useReveal } from "@/components/use-reveal";

type ScrollRevealVariant = "fade-slide" | "scale";

const HIDDEN: Record<ScrollRevealVariant, string> = {
  "fade-slide": "opacity-0 translate-y-6",
  scale: "opacity-0 scale-0",
};
const VISIBLE: Record<ScrollRevealVariant, string> = {
  "fade-slide": "opacity-100 translate-y-0",
  scale: "opacity-100 scale-100",
};

/**
 * Fade/slide/scale-in wrapper, triggered once via IntersectionObserver (see use-reveal.ts).
 * `as="li"` is needed for timeline/list items — a bare <div> isn't valid inside a <ul>.
 * `delayMs` is applied inline (not a Tailwind class) since it's computed per-item at runtime
 * (stagger), not one of a fixed set of values.
 */
export function ScrollReveal({
  children,
  className,
  delayMs = 0,
  variant = "fade-slide",
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  variant?: ScrollRevealVariant;
  as?: "div" | "li";
}) {
  const [ref, revealed] = useReveal<HTMLElement>();
  const Tag = as;

  return (
    <Tag
      ref={ref as Ref<HTMLDivElement> & Ref<HTMLLIElement>}
      className={cn(
        "transition-[opacity,transform] duration-500 motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 motion-reduce:scale-100",
        revealed ? VISIBLE[variant] : HIDDEN[variant],
        className
      )}
      style={delayMs ? { transitionDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
