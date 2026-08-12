import { ReactNode } from "react";

// Small tinted box for a diagram's caption/legend — unlike every other image caption on this
// page (plain grey centered text), this one is a real styled box, confirmed against bottom2.png.
export function LegendBox({ children }: { children: ReactNode }) {
  return (
    <div className="not-prose mt-[clamp(1rem,2vw,1.5rem)] rounded-[16px] bg-accent-orange/15 p-[clamp(0.75rem,1.5vw,1.25rem)] text-sm text-body">
      {children}
    </div>
  );
}
