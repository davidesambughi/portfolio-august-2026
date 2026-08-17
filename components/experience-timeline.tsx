"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

export type TimelineNode = {
  id: string;
  title: string;
  subtitle: string;
  dateRange: string | null;
  description: string | null;
  isFuture: boolean;
  /** Precomputed server-side (by chronological position) so an entry keeps the same dot color on
   *  both the desktop and mobile timelines, even though the two display entries in different order. */
  dotColorClass: string;
  /** Soft tint of the same color as dotColorClass, applied on hover instead of a flat neutral. */
  hoverBgClass: string;
};

// Grid col-start-N utilities are used per node index (max 4: 3 real entries + the decorative
// "Future" node) — Tailwind's default scale covers col-start-1..4 already, no lookup needed
// beyond this array for readability.
const COL_START = ["col-start-1", "col-start-2", "col-start-3", "col-start-4"] as const;

export function ExperienceTimeline({
  desktopNodes,
  mobileNodes,
}: {
  desktopNodes: TimelineNode[];
  mobileNodes: TimelineNode[];
}) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setExpandedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <>
      {/* Desktop: horizontal timeline, alternating nodes above/below a shared dotted line.
          Marker dots (small, per-label) and the big dots on the shared line are both anchored to
          the left edge of their grid column inside an identical w-2.5 box, so their centers land
          on the same x regardless of label content — centering only the big dot in its (much
          wider) column while left-anchoring the marker, the original bug, put them at different
          x positions entirely. Row1/row3 use `justify-end`/`justify-start` (not a fixed height)
          so a node's connector always touches the shared row even when another node's label
          expands and grows that row's height — the expanding node's extra space appears above/
          below its own label, not as a gap in anyone's connector. */}
      <div
        className="mt-[clamp(3rem,8vh,5rem)] hidden lg:grid"
        style={{ gridTemplateColumns: `repeat(${desktopNodes.length}, 1fr)` }}
      >
        <div
          className="col-span-full row-start-2 self-center border-t-2 border-dotted border-accent-purple"
          aria-hidden="true"
        />
        {desktopNodes.map((node, index) => {
          const colClass = COL_START[index % COL_START.length];

          return (
            <div
              key={node.id}
              className={cn(colClass, "row-start-2 flex w-2.5 justify-self-start")}
            >
              <span
                className="size-4 shrink-0 rounded-full bg-accent-purple shadow-[0_0_0_4px_rgba(255,255,255,.9)]"
                aria-hidden="true"
              />
            </div>
          );
        })}
        {desktopNodes.map((node, index) => {
          const isAbove = index % 2 === 0;
          const colClass = COL_START[index % COL_START.length];
          const isExpanded = expandedIds.has(node.id);

          const marker = (
            <span className="flex w-2.5 shrink-0 items-center justify-center">
              <span className={cn("size-2.5 rounded-full", node.dotColorClass)} aria-hidden="true" />
            </span>
          );
          const text = (
            <div
              className={cn(
                "-mx-2 flex max-w-[17.5rem] flex-col gap-0.5 rounded-lg px-2 py-1 text-left transition-colors duration-200",
                node.hoverBgClass
              )}
            >
              <span className="flex items-center gap-1.5 font-bold text-heading">
                {node.title}
                {/* Expand affordance (8d) — every real node always shows its chevron, only
                    this node's own `isExpanded` rotates it, mirroring 8c's accordion chevron. */}
                {!node.isFuture && (
                  <ChevronDown
                    className={cn(
                      "size-4 shrink-0 text-body transition-transform duration-200",
                      isExpanded && "rotate-180"
                    )}
                    aria-hidden="true"
                  />
                )}
              </span>
              {node.subtitle && <span className="text-sm text-body">{node.subtitle}</span>}
              {node.dateRange && <span className="text-sm text-body">{node.dateRange}</span>}
              {isExpanded && node.description && (
                <p className="mt-1 text-sm text-body">{node.description}</p>
              )}
            </div>
          );
          const label = node.isFuture ? (
            <div className="flex items-start gap-2">
              {marker}
              {text}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => toggle(node.id)}
              aria-expanded={isExpanded}
              className="group flex cursor-pointer items-start gap-2 rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              {marker}
              {text}
            </button>
          );
          const connector = (
            <span className="flex w-2.5 justify-center">
              <span className="h-[clamp(4rem,7vw,6rem)] w-px bg-body" aria-hidden="true" />
            </span>
          );

          return isAbove ? (
            <div
              key={node.id}
              className={cn(colClass, "row-start-1 flex flex-col items-start justify-end gap-2")}
            >
              {label}
              {connector}
            </div>
          ) : (
            <div
              key={node.id}
              className={cn(colClass, "row-start-3 flex flex-col items-start justify-start gap-2")}
            >
              {connector}
              {label}
            </div>
          );
        })}
      </div>

      {/* Mobile: vertical timeline — same graphic language as desktop (colored marker dots, a
          connecting line, click-to-expand), rotated 90°: the line runs top-to-bottom along the
          left edge instead of left-to-right. Each dot's line-segment is the *next* item's own
          flex-1 child, so it's continuous through the gap between items with no extra element;
          the last item renders no segment (nothing below it to connect to). Reads most-recent-
          first (the "Future" node placed first, above even the newest real entry) — the opposite
          direction from the desktop timeline's oldest-to-newest reading, per user decision. */}
      <ul className="mt-[clamp(2rem,5vh,3.5rem)] flex flex-col lg:hidden">
        {mobileNodes.map((node, index) => {
          const isExpanded = expandedIds.has(node.id);
          const isLast = index === mobileNodes.length - 1;

          const text = (
            <div
              className={cn(
                "-mx-2 flex flex-col gap-0.5 rounded-lg px-2 py-1 text-left transition-colors duration-200",
                node.hoverBgClass
              )}
            >
              <span className="flex items-center gap-1.5 font-bold text-heading">
                {node.title}
                {/* Expand affordance (8d) — same chevron as the desktop timeline above. */}
                {!node.isFuture && (
                  <ChevronDown
                    className={cn(
                      "size-4 shrink-0 text-body transition-transform duration-200",
                      isExpanded && "rotate-180"
                    )}
                    aria-hidden="true"
                  />
                )}
              </span>
              {node.subtitle && <span className="text-sm text-body">{node.subtitle}</span>}
              {node.dateRange && <span className="text-sm text-body">{node.dateRange}</span>}
              {isExpanded && node.description && (
                <p className="mt-1 text-base text-body">{node.description}</p>
              )}
            </div>
          );

          return (
            <li key={node.id} className="flex gap-3">
              <div className="flex w-2.5 shrink-0 flex-col items-center">
                <span
                  className={cn("mt-1.5 size-2.5 shrink-0 rounded-full", node.dotColorClass)}
                  aria-hidden="true"
                />
                {!isLast && <span className="mt-1 w-px flex-1 bg-body" aria-hidden="true" />}
              </div>
              {node.isFuture ? (
                <div className="pb-6">{text}</div>
              ) : (
                <button
                  type="button"
                  onClick={() => toggle(node.id)}
                  aria-expanded={isExpanded}
                  className="group flex-1 cursor-pointer rounded-lg pb-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                >
                  {text}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}
