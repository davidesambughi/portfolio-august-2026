"use client";

import { cn } from "@/lib/utils";
import { useReveal } from "@/components/use-reveal";

// Same grow-0-to-52px bar as AccordionSectionHeading (13b), replicated as its own tiny client
// component since About's manual heading markup lives in a Server Component (`about-section.tsx`,
// `async function`) — a hook like useReveal can't be called there directly.
export function AboutAccentBar({ className }: { className?: string }) {
  const [ref, revealed] = useReveal<HTMLSpanElement>();

  return (
    <span
      ref={ref}
      className={cn(
        "mt-[14px] block h-[5px] rounded-full bg-[oklch(0.8655_0.1595_96)] transition-[width] duration-500 motion-reduce:transition-none motion-reduce:w-[52px]",
        revealed ? "w-[52px]" : "w-0",
        className
      )}
      style={{ transitionDelay: "500ms" }}
      aria-hidden="true"
    />
  );
}
