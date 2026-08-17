"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

import { LanguageSwitcher } from "@/components/language-switcher";
import { useMobileAccordion } from "@/components/mobile-accordion-context";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

// The five sections collapsible on mobile (8c-homepage-mobile-accordion.md) — "home"/"contacts"
// are excluded from the accordion and keep their existing scroll-spy-driven behavior below.
const ACCORDION_ANCHORS = new Set(["projects", "education", "experience", "skills", "about"]);

// Section keys drive both the translated label and the target anchor id. "home" is the Hero
// section itself — it goes bold via the same scroll-spy observer as every other item, but links
// to "/" (not "/#hero") since Hero is already the top of the page.
const NAV_ITEMS = [
  { key: "home", anchor: "hero" },
  { key: "projects", anchor: "projects" },
  { key: "education", anchor: "education" },
  { key: "experience", anchor: "experience" },
  { key: "techStack", anchor: "skills" },
  { key: "about", anchor: "about" },
  { key: "contacts", anchor: "contacts" },
] as const;

export function Nav() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const [activeAnchor, setActiveAnchor] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  // `null` on the Project Detail Page (09e reuses Nav there, but it has no accordion shell) —
  // the five accordion anchors fall back to plain scroll behavior in that case.
  const mobileAccordion = useMobileAccordion();

  // Publishes Nav's real rendered height as a CSS custom property (--nav-height) on the root
  // element, so Hero (a sibling, not a wrapping ancestor — see hero.tsx) can size itself to
  // exactly "one viewport minus the real nav height" via calc(), instead of a guessed fixed
  // number. Nav's own height is fluid (clamp()-based padding/text-size, and taller once the
  // mobile panel opens), so a ResizeObserver keeps the variable accurate across breakpoints and
  // state changes rather than measuring once on mount.
  useEffect(() => {
    const el = navRef.current;
    if (!el) return;
    const setHeightVar = () => {
      document.documentElement.style.setProperty("--nav-height", `${el.offsetHeight}px`);
    };
    setHeightVar();
    const observer = new ResizeObserver(setHeightVar);
    observer.observe(el);
    return () => observer.disconnect();
  }, [open]);

  // Scroll-spy: whichever section currently sits in a thin band near the top of the viewport
  // (not "anywhere visible" — a tall section would stay "active" long after the user scrolled
  // past its heading) is the active one. Sections that don't exist yet (Tech Stack/About/
  // Contacts, unit 08) are simply absent from `sections` below and get skipped automatically.
  useEffect(() => {
    const sections = NAV_ITEMS.map(({ anchor }) => document.getElementById(anchor)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (sections.length === 0) return;

    // A section taller than the viewport (e.g. About, with its tall photo mosaic) can still
    // span the observer's thin -40%/-55% band even once the page has hit its maximum scroll
    // position — so at the very bottom, the last section (Contacts/footer, usually shorter than
    // that band) never becomes "topmost" on its own. isAtBottom() is checked first, in both the
    // observer callback and the scroll listener below, so it always wins over whatever the
    // observer would otherwise report once there's no more room to scroll.
    const isAtBottom = () =>
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 1;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isAtBottom()) {
          setActiveAnchor("contacts");
          return;
        }
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) return;
        const topMost = visible.reduce((a, b) =>
          a.boundingClientRect.top <= b.boundingClientRect.top ? a : b
        );
        setActiveAnchor(topMost.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));

    const handleScroll = () => {
      if (isAtBottom()) setActiveAnchor("contacts");
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Mobile hamburger panel only, for the five accordion anchors: opens the section (never closes
  // it — closing stays the section's own trigger's job) instead of jumping via a plain hash
  // anchor, then scrolls to it once its expand transition has had a chance to run (a scroll fired
  // immediately would target the old, still-collapsed layout). Falls back to plain link behavior
  // when `mobileAccordion` is null (Nav rendered outside the homepage's accordion shell, i.e. the
  // Project Detail Page — see 09e).
  const handleAccordionAnchorClick =
    (anchor: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
      setOpen(false);
      if (!mobileAccordion) return;
      event.preventDefault();
      const { openSections, setOpenSections } = mobileAccordion;
      if (!openSections.includes(anchor)) {
        setOpenSections([...openSections, anchor]);
      }
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      });
    };

  // "Home" links to "/" (Hero is already the top of the page), but since this is a single-page
  // site the homepage route never actually changes when already on it — Next.js sees no route
  // change and skips any navigation/scroll, so the Link alone silently did nothing. Force the
  // scroll explicitly instead of relying on route-change scroll restoration.
  const handleHomeClick = () => {
    setOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    // Same fluid container as Hero (see ui_context.md "Layout — container e larghezza") so the
    // nav's left/right edges line up with the rest of the page instead of floating centered with
    // its own unrelated margins.
    <nav
      ref={navRef}
      className="sticky top-0 z-50 mx-auto w-full max-w-[1800px] px-[clamp(1.5rem,4vw,6rem)] py-[clamp(0.75rem,2vh,1rem)]"
    >
      {/* rounded-full only fits the collapsed pill bar; once the mobile panel expands the
          container grows taller than it is wide, so the theme's pill radius (9999px) would
          clip it into an oval instead of a rounded rectangle — use an explicit radius then. */}
      <div
        className={`mx-auto w-full max-w-4xl border border-black/15 bg-white/[0.92] shadow-[0_6px_20px_rgba(0,0,0,.10)] backdrop-blur-md ${open ? "rounded-[28px]" : "rounded-full"}`}
      >
        <div className="flex items-center px-4 py-1.5 md:justify-between md:py-2">
          {/* Desktop-only left spacer: an empty third flex item, matched with `justify-between`
              below. Previously this and the right cluster were both `flex-1` with `justify-end`
              on the right one — that made both sides *grow* equally, but since the right cluster
              already contained real content (the language switcher) pinned flush to the edge, the
              grown space landed *between the links and the switcher* instead of on both true outer
              edges, so the links ended up visibly off-center (more blank space on the left).
              `justify-between` with three items (this empty spacer, the links, the cluster)
              distributes free space into the two *gaps* — before the links and after them — which
              are then equal by construction, regardless of the switcher's width. */}
          <div className="hidden md:block" aria-hidden="true" />

          {/* Fluid gap (2026-08-12 fix), not a fixed `md:gap-8 xl:gap-12` tier: at that fixed 48px
              gap, Italian's longer labels (Formazione, Esperienza, Contatti vs. Education,
              Experience, Contacts) made the link row's real content width exceed the pill's
              available space (max-w-4xl) — the whole row overflowed past its own right padding,
              pushing the language switcher past the pill's border (looked like "no padding" but
              was actual overflow). Same class of bug as unit 04's fixed-breakpoint issues —
              clamp() scales the gap down continuously instead of jumping straight to 48px. */}
          <div className="hidden md:flex md:items-center gap-[clamp(1rem,1.5vw,3rem)]">
            {NAV_ITEMS.map(({ key, anchor }) => (
              <Link
                key={key}
                href={key === "home" ? "/" : `/#${anchor}`}
                // Same fix as the mobile panel: clicking "Home" while already on "/" is not a
                // route change, so Next.js does nothing on its own — force the scroll explicitly.
                onClick={key === "home" ? () => window.scrollTo({ top: 0, behavior: "smooth" }) : undefined}
                className={cn(
                  "rounded-full px-3 py-1 text-sm whitespace-nowrap transition-colors hover:bg-muted",
                  activeAnchor === anchor ? "font-bold text-heading" : "text-body"
                )}
              >
                {t(key)}
              </Link>
            ))}
          </div>

          {/* Right cluster: language switcher is always visible (desktop + mobile), the hamburger
              only on mobile — flush to the edge on both, per user request (2026-08-12). `shrink-0`
              protects its width from ever being squeezed by Italian's longer link labels. `ml-auto`
              is mobile-only positioning (pushes the cluster right when the spacer/links are
              hidden); `md:ml-0` hands positioning over to the row's `justify-between` at desktop,
              since an auto margin would otherwise swallow all the `justify-between` free space
              itself instead of splitting it into the two gaps around the links. */}
          <div className="ml-auto flex shrink-0 items-center gap-1 md:ml-0">
            <LanguageSwitcher />
            <button
              type="button"
              aria-expanded={open}
              aria-controls="mobile-nav-panel"
              aria-label={t("menuToggle")}
              onClick={() => setOpen((value) => !value)}
              className="flex size-9 items-center justify-center rounded-full transition-colors hover:bg-muted md:hidden"
            >
              <MenuIcon open={open} />
            </button>
          </div>
        </div>

        {open && (
          <div
            id="mobile-nav-panel"
            className="flex flex-col gap-1 px-4 pb-4 md:hidden"
          >
            {NAV_ITEMS.map(({ key, anchor }) => {
              const isAccordionAnchor = ACCORDION_ANCHORS.has(anchor);
              // Bold always follows scroll position (activeAnchor), for every item — including
              // the five accordion anchors. Previously these five bolded on `openSections`
              // instead, which meant opening every section at once bolded the entire menu with
              // no way to tell which one the user was actually looking at.
              const isActive = activeAnchor === anchor;
              const onClick = key === "home"
                ? handleHomeClick
                : isAccordionAnchor
                  ? handleAccordionAnchorClick(anchor)
                  : () => setOpen(false);
              return (
                <Link
                  key={key}
                  href={key === "home" ? "/" : `/#${anchor}`}
                  onClick={onClick}
                  className={cn(
                    "rounded-full px-3 py-2 text-sm transition-colors hover:bg-muted",
                    isActive ? "font-bold text-heading" : "text-body"
                  )}
                >
                  {t(key)}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        className="size-4 text-body"
        aria-hidden="true"
      >
        <path d="M6 6l12 12M18 6L6 18" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      className="size-4 text-body"
      aria-hidden="true"
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}
