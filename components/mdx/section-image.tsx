"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

// Single captioned image, sized as a flex sibling to a text column (see the .mdx source's
// outer flex row) — distinct from DashboardGallery's fixed 3-box collage and FlowDiagram's
// always-full-width image. aspectClassName/widthClassName are passed per instance since this
// component is reused across microfasi with different image shapes and column proportions
// (e.g. bottom1's narrowed lg:w-[38%] vs bottom2's lg:flex-1). caption is optional — bottom2's
// instance has no caption underneath the image, since a LegendBox in the text column covers
// that role instead. lightbox is opt-in per instance (only the Stripe diagram uses it so far,
// per explicit user request) — click to open a fullscreen overlay, click backdrop or Escape to close.
// frame controls the rounded bg-muted box around the image — defaults to true (used as a visible
// placeholder box for images that don't exist yet); set to false for a real image whose own
// background/whitespace should just blend into the page instead of sitting in a grey box.
// fillHeight is opt-in for a row that uses lg:items-stretch on its flex parent (see the .mdx
// source) — instead of a fixed aspect-ratio box, the image grows to fill whatever height the
// stretched row gives its column at lg+, so it visually matches a taller text sibling instead of
// sitting short and top-anchored. Below lg (stacked, no stretch context) it still falls back to
// aspectClassName, since there's no row height to fill.
export function SectionImage({
  src,
  alt,
  caption,
  aspectClassName,
  widthClassName,
  lightbox = false,
  frame = true,
  fillHeight = false,
}: {
  src: string;
  alt: string;
  caption?: string;
  aspectClassName: string;
  widthClassName: string;
  lightbox?: boolean;
  frame?: boolean;
  fillHeight?: boolean;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const boxShape = fillHeight
    ? `${aspectClassName} lg:aspect-auto lg:min-h-0 lg:flex-1`
    : aspectClassName;

  return (
    <div
      className={`not-prose w-full ${widthClassName} ${fillHeight ? "lg:flex lg:flex-col" : ""}`}
    >
      {lightbox ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={alt}
          className={`relative block w-full ${boxShape} cursor-zoom-in ${frame ? "overflow-hidden rounded-[20px] bg-muted" : ""}`}
        >
          <Image src={src} alt={alt} fill className="object-contain" />
        </button>
      ) : (
        <div
          className={`relative ${boxShape} ${frame ? "overflow-hidden rounded-[20px] bg-muted" : ""}`}
        >
          <Image src={src} alt={alt} fill className="object-contain" />
        </div>
      )}
      {caption ? (
        <p className="mt-2 text-center text-sm text-body">{caption}</p>
      ) : null}

      {lightbox && open ? (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-black/85 p-[clamp(1rem,4vw,3rem)]"
        >
          <div className="relative h-full w-full">
            <Image src={src} alt={alt} fill className="object-contain" />
          </div>
        </div>
      ) : null}
    </div>
  );
}
