"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { ExternalLink, X } from "lucide-react";

import type { Certificate } from "@/content/data/skills";

// Click-to-expand lightbox, same pattern as Education's diploma/PDF preview
// (components/education-list.tsx) — full certificate image + "open original PDF" link.
export function CertificatesList({ certificates }: { certificates: Certificate[] }) {
  const locale = useLocale() as "en" | "it";
  const [openId, setOpenId] = useState<string | null>(null);
  const open = certificates.find((c) => c.id === openId) ?? null;

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenId(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <ul className="mt-[clamp(0.75rem,2vw,1.25rem)] grid grid-cols-1 gap-[clamp(1rem,3vw,1.75rem)] sm:grid-cols-2">
        {certificates.map((certificate) => (
          <li key={certificate.id}>
            <button
              type="button"
              onClick={() => setOpenId(certificate.id)}
              className="flex w-full cursor-zoom-in items-center gap-[clamp(0.5rem,1.5vw,0.75rem)] rounded-lg transition-transform duration-200 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              aria-label={certificate.label}
            >
              <Image
                src={certificate.imageSrc}
                alt={certificate.label}
                width={64}
                height={48}
                className="h-[clamp(1.75rem,4vw,2.5rem)] w-auto shrink-0 rounded-md object-contain"
              />
              <span className="whitespace-nowrap text-sm font-medium text-body">
                {certificate.label}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={open.label}
          className="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-black/85 p-[clamp(1rem,4vw,3rem)] backdrop-blur-sm"
          onClick={() => setOpenId(null)}
        >
          <div className="absolute top-4 right-4 z-10 flex items-center gap-3">
            {open.pdfUrl && (
              <a
                href={open.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/30 backdrop-blur-md"
              >
                {locale === "it" ? "Apri PDF originale ↗" : "Open Original PDF ↗"}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
            <button
              type="button"
              onClick={() => setOpenId(null)}
              className="cursor-pointer rounded-full bg-white/20 p-2 text-white transition-colors hover:bg-white/30 backdrop-blur-md"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="relative h-full w-full max-w-4xl">
            <Image src={open.imageSrc} alt={open.label} fill className="object-contain" />
          </div>
        </div>
      )}
    </>
  );
}
