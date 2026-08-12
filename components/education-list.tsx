"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ExternalLink, X } from "lucide-react";

import { formatDateRange } from "@/lib/format-date";
import { cn } from "@/lib/utils";
import type { Education } from "@/types/education";

// Cycles by list position (not click order): 1st entry's selected border is blue, 2nd yellow,
// 3rd green, then repeats if more entries are added later.
const SELECTED_BORDER_CLASSES = [
  "border-accent-blue",
  "border-accent-yellow",
  "border-accent-green",
] as const;

export function EducationList({ education }: { education: Education[] }) {
  const locale = useLocale() as "en" | "it";
  const t = useTranslations("education");
  const [selectedId, setSelectedId] = useState(education[0]?.id);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const selected = education.find((entry) => entry.id === selectedId) ?? education[0];

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxOpen]);

  return (
    <div className="mt-[clamp(2.5rem,6vh,4rem)] flex flex-col items-center gap-10 lg:flex-row lg:items-stretch lg:gap-[clamp(2rem,4vw,4rem)]">
      {/* Left Panel */}
      <div
        className={cn(
          "flex w-full max-w-md items-center justify-center rounded-[28px] p-6 text-center sm:p-8 lg:w-[30%] lg:shrink-0",
          selected?.logoUrl ? "bg-transparent" : "bg-accent-blue"
        )}
      >
        {selected?.logoUrl ? (
          <button
            type="button"
            onClick={() => selected?.pdfUrl && setLightboxOpen(true)}
            disabled={!selected?.pdfUrl}
            className={cn(
              "relative flex h-full w-full min-h-[180px] items-center justify-center transition-transform duration-200",
              selected?.pdfUrl ? "cursor-zoom-in hover:scale-[1.02]" : "cursor-default"
            )}
            aria-label={selected.institution}
          >
            <Image
              src={selected.logoUrl}
              alt={selected.institution}
              width={350}
              height={350}
              className="max-h-64 w-full max-w-full object-contain rounded-xl"
            />
          </button>
        ) : (
          <span className="text-[clamp(1.5rem,1rem+2vw,2.25rem)] leading-snug font-bold text-on-accent">
            {selected?.institution}
          </span>
        )}
      </div>

      {/* Right List */}
      <ul className="flex w-full flex-col gap-4 lg:w-[70%]">
        {education.map((entry, index) => {
          const isSelected = entry.id === selectedId;
          const selectedBorderClass =
            SELECTED_BORDER_CLASSES[index % SELECTED_BORDER_CLASSES.length];

          return (
            <li key={entry.id}>
              <button
                type="button"
                onClick={() => setSelectedId(entry.id)}
                aria-pressed={isSelected}
                className={cn(
                  "-mr-2 block w-full cursor-pointer rounded-r-lg border-l-[3px] py-2 pr-2 pl-6 text-left transition-colors duration-200 hover:bg-muted focus-visible:bg-muted focus-visible:outline-none",
                  isSelected ? selectedBorderClass : "border-border"
                )}
              >
                <span
                  className={cn(
                    "block transition-all duration-200",
                    isSelected
                      ? "text-[clamp(1.5rem,1.1rem+1.5vw,2.25rem)] leading-snug font-bold text-heading"
                      : "text-sm font-normal text-subheading"
                  )}
                >
                  {entry.institution} — {entry.degree[locale]}
                </span>

                {isSelected && (
                  <div className="mt-3 flex flex-col gap-2">
                    <span className="text-sm text-body">
                      {[
                        entry.location,
                        formatDateRange(entry.startDate, entry.endDate, t("present"), locale),
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                    {entry.description && (
                      <p className="text-base text-body">{entry.description[locale]}</p>
                    )}
                  </div>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {/* Clean Fullscreen Lightbox Overlay */}
      {selected?.logoUrl && selected?.pdfUrl && lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selected.institution}
          className="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-black/85 p-[clamp(1rem,4vw,3rem)] backdrop-blur-sm"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Action header bar */}
          <div className="absolute top-4 right-4 z-10 flex items-center gap-3">
            <a
              href={selected.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-4 py-2 text-xs font-semibold text-white hover:bg-white/30 transition-colors backdrop-blur-md"
            >
              {locale === "it" ? "Apri PDF originale ↗" : "Open Original PDF ↗"}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="rounded-full bg-white/20 p-2 text-white hover:bg-white/30 transition-colors cursor-pointer backdrop-blur-md"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Clean full size document image */}
          <div className="relative h-full w-full max-w-4xl">
            <Image
              src={selected.logoUrl}
              alt={selected.institution}
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
