"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Tracks whether an element has scrolled into view (80% viewport trigger), once — never resets on
 * scroll-up. Skips the observer entirely when the user prefers reduced motion: `revealed` starts
 * `true` immediately, so callers render their final (visible) state on first paint, no animation.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Must run post-mount, not during render: `window.matchMedia` isn't available server-side,
      // so reading it in a lazy useState initializer would mismatch the server-rendered HTML
      // (same reasoning as toc.tsx's heading-collection effect).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRevealed(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0, rootMargin: "0px 0px -20% 0px" }
    );
    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  // Returned as a tuple, not `{ ref, revealed }` — the object form tripped
  // react-hooks/refs (it treated plain property reads like `.revealed` on the returned object as
  // an unsafe ref access, since the same object also carries a ref). A tuple destructure
  // (`const [ref, revealed] = useReveal()`) doesn't hit that heuristic.
  return [ref, revealed] as const;
}
