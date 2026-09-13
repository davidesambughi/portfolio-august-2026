"use client";

import { useEffect, useState } from "react";

// The scrollytelling breakpoint used throughout this feature: pinned/animated
// chrome and chapters run only at >=820px, matching the mobile static layout's
// own breakpoint (`min-[820px]:` in Tailwind). Starts `false` so SSR and the
// first client render agree — flips (if true) inside an effect, post-mount.
export function useIsDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 820px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return isDesktop;
}
