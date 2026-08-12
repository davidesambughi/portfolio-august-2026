"use client";

import { Drawer } from "@base-ui/react/drawer";
import { ArrowUp, List, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type TocItem = { id: string; label: string };

// Project Detail Page only (see 09g spec) — reads its items straight from the rendered
// h2[id]s inside #project-content, so labels always match the current locale without a
// parallel translated data source. Renders nothing if the page has no h2s (nothing to link to).
export function Toc() {
  const t = useTranslations("toc");
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  // Separate open state per breakpoint's UI, not one shared boolean: Drawer.Portal renders its
  // content into document.body, escaping the "lg:hidden" wrapper around the mobile bar/trigger —
  // sharing one `open` meant opening the desktop panel also opened the (invisibly-portaled but
  // still fully rendered) mobile sheet underneath it. Only activeId/visible are shared, per spec.
  const [desktopOpen, setDesktopOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = document.getElementById("project-content");
    if (!container) return;
    const headings = Array.from(container.querySelectorAll<HTMLHeadingElement>("h2[id]"));
    // Must run post-mount, not during render: the headings come from server-rendered MDX
    // content this component doesn't own, and reading them during render (e.g. a useState
    // lazy initializer) would return [] on the server (no `document`) but real items on the
    // client, causing a hydration mismatch. This effect intentionally renders null on both
    // server and first client paint, then fills in after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(headings.map((h) => ({ id: h.id, label: h.textContent ?? "" })));
  }, []);

  // Scroll-spy: same rootMargin-band technique as components/nav.tsx's IntersectionObserver.
  useEffect(() => {
    if (items.length === 0) return;
    const headings = items
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length === 0) return;
        const topMost = visibleEntries.reduce((a, b) =>
          a.boundingClientRect.top <= b.boundingClientRect.top ? a : b
        );
        setActiveId(topMost.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [items]);

  // Visibility: hidden until the reader scrolls past the page header, hidden again once the
  // footer sentinel comes into view. Two zero-height sentinels (rendered in page.tsx) mark the
  // boundaries, tracked the same way nav.tsx tracks "am I at the bottom of the page".
  useEffect(() => {
    const top = document.getElementById("toc-visibility-start");
    const bottom = document.getElementById("toc-visibility-end");
    if (!top || !bottom) return;

    let pastTop = false;
    let nearBottom = false;

    const topObserver = new IntersectionObserver(
      ([entry]) => {
        pastTop = !entry.isIntersecting && entry.boundingClientRect.top < 0;
        setVisible(pastTop && !nearBottom);
      },
      { threshold: 0 }
    );
    const bottomObserver = new IntersectionObserver(
      ([entry]) => {
        nearBottom = entry.isIntersecting;
        setVisible(pastTop && !nearBottom);
        if (nearBottom) {
          setDesktopOpen(false);
          setMobileOpen(false);
        }
      },
      { threshold: 0 }
    );
    topObserver.observe(top);
    bottomObserver.observe(bottom);
    return () => {
      topObserver.disconnect();
      bottomObserver.disconnect();
    };
  }, []);

  // Desktop expanded panel: click outside, or Escape, collapses it back to the tab — same
  // interaction category as SectionImage's lightbox and Nav's mobile panel.
  useEffect(() => {
    if (!desktopOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setDesktopOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDesktopOpen(false);
    };
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [desktopOpen]);

  if (items.length === 0) return null;

  const activeLabel = items.find((item) => item.id === activeId)?.label;
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <>
      {/* Desktop: collapsed tab / expanded overlay panel, fixed to the viewport's left edge —
          doesn't reserve layout space, sits on top of the content when open. */}
      <div
        className={cn(
          "fixed top-1/2 left-[clamp(0.5rem,1.5vw,1.5rem)] z-40 hidden -translate-y-1/2 transition-all duration-200 lg:block",
          visible ? "translate-x-0 opacity-100" : "pointer-events-none -translate-x-4 opacity-0"
        )}
      >
        <div
          ref={panelRef}
          className={cn(
            "overflow-hidden rounded-[20px] border border-black/10 bg-background/70 shadow-md backdrop-blur-md transition-[width] duration-200",
            desktopOpen ? "w-64 p-4" : "w-10 p-2"
          )}
        >
          {desktopOpen ? (
            <div>
              <p className="text-xs font-bold tracking-wide text-body uppercase">
                {t("inThisGuide")}
              </p>
              <ol className="mt-3 flex flex-col gap-2">
                {items.map((item, index) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onClick={() => setDesktopOpen(false)}
                      className={cn(
                        "block text-sm transition-transform duration-200",
                        activeId === item.id ? "translate-x-1 font-bold text-heading" : "text-body"
                      )}
                    >
                      {index + 1}. {item.label}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setDesktopOpen(true)}
              aria-label={t("inThisGuide")}
              className="flex size-6 items-center justify-center text-body"
            >
              <List className="size-5" aria-hidden />
            </button>
          )}
        </div>
      </div>

      {/* Mobile: floating bottom bar + Base UI Drawer bottom sheet. */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 transition-all duration-200 lg:hidden",
          visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        )}
      >
        <Drawer.Root open={mobileOpen} onOpenChange={setMobileOpen}>
          <div className="flex items-center gap-3 border-t border-border bg-background/80 px-4 py-3 backdrop-blur-md">
            <Drawer.Trigger className="flex flex-1 items-center gap-2 overflow-hidden text-left">
              <List className="size-4 shrink-0 text-body" aria-hidden />
              <span className="truncate text-sm">
                <span className="text-body">{t("inThisGuide")}</span>
                {activeLabel ? (
                  <span className="ml-2 font-bold text-heading">{activeLabel}</span>
                ) : null}
              </span>
            </Drawer.Trigger>
            <button
              type="button"
              onClick={scrollToTop}
              aria-label={t("backToTop")}
              className="flex size-8 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-muted"
            >
              <ArrowUp className="size-4 text-body" aria-hidden />
            </button>
          </div>

          <Drawer.Portal>
            <Drawer.Backdrop className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0" />
            <Drawer.Viewport className="fixed inset-0 z-50 flex items-end justify-center">
              <Drawer.Popup className="w-full rounded-t-[24px] bg-background p-6 pb-[clamp(1.5rem,4vw,2.5rem)] shadow-lg outline-none transition-transform duration-200 data-ending-style:translate-y-full data-starting-style:translate-y-full">
                <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-muted" />
                <div className="mb-4 flex items-center justify-between">
                  <Drawer.Title className="text-xs font-bold tracking-wide text-body uppercase">
                    {t("inThisGuide")}
                  </Drawer.Title>
                  <Drawer.Close
                    aria-label={t("close")}
                    className="flex size-8 items-center justify-center rounded-full transition-colors hover:bg-muted"
                  >
                    <X className="size-4 text-body" aria-hidden />
                  </Drawer.Close>
                </div>
                <ol className="flex max-h-[50vh] flex-col gap-3 overflow-y-auto">
                  {items.map((item, index) => (
                    <li key={item.id}>
                      {/* Plain <a>, not Drawer.Close's `render` prop — Base UI's render prop
                          forces role="button" onto the element, discouraged for real links
                          (see components/hero.tsx's CTA precedent). Closing is handled by
                          mobileOpen instead. */}
                      <a
                        href={`#${item.id}`}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "block text-sm",
                          activeId === item.id ? "font-bold text-heading" : "text-body"
                        )}
                      >
                        {index + 1}. {item.label}
                      </a>
                    </li>
                  ))}
                </ol>
              </Drawer.Popup>
            </Drawer.Viewport>
          </Drawer.Portal>
        </Drawer.Root>
      </div>
    </>
  );
}
