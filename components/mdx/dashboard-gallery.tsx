import Image from "next/image";

// Fixed 3-slot staggered collage (client PC + admin mobile in row 1, operator PC in row 2),
// authored directly as JSX inside a case study's .mdx body, as the first child of a shared flex
// row (see the .mdx source) that also holds the steps list — this component only owns its own
// column width (w-full below lg, 40% of the row at lg+), not the two-column split itself.
// Row 1's boxes use simple round-number widths, not a shared height: each box's height follows
// independently from its own width + aspect-ratio, per the 2026-08-09 revision.
export function DashboardGallery({
  clientPcSrc,
  clientPcAlt,
  clientPcAspectClassName = "aspect-[4/3]",
  adminMobileSrc,
  adminMobileAlt,
  adminMobileAspectClassName = "aspect-[9/19]",
  operatorPcSrc,
  operatorPcAlt,
  operatorPcAspectClassName = "aspect-[2/1]",
  caption,
}: {
  clientPcSrc: string;
  clientPcAlt: string;
  clientPcAspectClassName?: string;
  adminMobileSrc: string;
  adminMobileAlt: string;
  adminMobileAspectClassName?: string;
  operatorPcSrc: string;
  operatorPcAlt: string;
  operatorPcAspectClassName?: string;
  caption: string;
}) {
  return (
    <div className="not-prose w-full lg:w-[40%]">
      <div className="flex gap-[clamp(0.75rem,1.5vw,1.25rem)]">
        <div
          className={`relative w-[62%] ${clientPcAspectClassName} overflow-hidden rounded-[20px] bg-muted`}
        >
          <Image src={clientPcSrc} alt={clientPcAlt} fill className="object-contain" />
        </div>
        <div
          className={`relative w-[30%] ${adminMobileAspectClassName} overflow-hidden rounded-[20px] bg-muted`}
        >
          <Image src={adminMobileSrc} alt={adminMobileAlt} fill className="object-contain" />
        </div>
      </div>
      <div className="mt-[clamp(1rem,2vw,1.5rem)] ml-[10%] w-[62%]">
        <div
          className={`relative ${operatorPcAspectClassName} overflow-hidden rounded-[20px] bg-muted`}
        >
          <Image src={operatorPcSrc} alt={operatorPcAlt} fill className="object-contain" />
        </div>
      </div>
      <p className="mt-[clamp(1rem,2vw,1.5rem)] text-center text-sm text-body">{caption}</p>
    </div>
  );
}

// Full-width flow-diagram image, rendered after the two-column gallery+steps row in normal block
// flow (no float involved on this page anymore, so no clearing needed). aspectClassName defaults
// to the original 16:7 placeholder guess but is overridable per instance — the two FlowDiagram
// usages on this page hold real images with very different native ratios. widthClassName lets a
// low-resolution source image render narrower than full width, instead of being upscaled past
// its native size (visibly grainy) to fill the container.
export function FlowDiagram({
  src,
  alt,
  caption,
  aspectClassName = "aspect-[16/7]",
  widthClassName = "w-full",
}: {
  src: string;
  alt: string;
  caption: string;
  aspectClassName?: string;
  widthClassName?: string;
}) {
  return (
    <div className={`not-prose mx-auto mt-[clamp(2.5rem,5vw,4rem)] ${widthClassName}`}>
      <div className={`relative ${aspectClassName} w-full overflow-hidden rounded-[24px] bg-muted`}>
        <Image src={src} alt={alt} fill className="object-contain" />
      </div>
      <p className="mt-2 text-center text-sm text-body">{caption}</p>
    </div>
  );
}
