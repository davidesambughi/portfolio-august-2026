## This file has to be written precisely, clearly , and concisely. Do not add , assume or invent, but ask for more information if you need it .

# 09g — Project Detail Page: TOC Sidebar

<!-- Read before starting: AGENTS.md, context/architecture_context.md, context/ui_context.md, context/features/09-project-detail-page.md, context/features/09b-project-detail-top1.md, context/features/09d-project-detail-bottom1.md, context/features/09e-project-detail-bottom2.md, context/features/09f-project-detail-architecture.md -->

Add an interactive table-of-contents component to the Project Detail Page — a collapsible left-side tab/panel on desktop, a floating bottom bar + bottom sheet on mobile — that links to and tracks the page's H2 sections.

---

## Architecture, rules and constraints

- **Explicit reversal of a prior decision.** Units 09b, 09d, and 09e each explicitly deferred the TOC sidebar, and 09b/09d recorded it as "static, zero `use client`, zero scroll-spy" if it were ever built. This unit reverses that: the TOC is fully interactive (`use client`, its own `IntersectionObserver`, click-to-expand, a mobile bottom sheet). **This must be logged as a new, dated decision in `architecture_context.md`'s "Deciso" section and in `progress_tracker.md`** — not silently applied. Reason for the reversal: with a second project now planned, a real interactive TOC is worth building instead of continuing to defer it (per the user's own 2026-08-10 note logged in 09b's Open Questions).
- **Scope**: this component renders only on the Project Detail Page (`app/[locale]/project/[slug]/page.tsx`) — not the homepage, which has its own `Nav` scroll-spy already (unit 04's scope addition) for a different purpose (page sections, not in-article headings). Currently only one real project (`remote-nif`) exists, but the component itself must not hardcode anything project-specific — it works generically for any project's rendered H2s.
- **Glassmorphism/blur — scoped, not a new sitewide pattern.** `Footer` (unit 8b) already uses a subtle `backdrop-blur-sm` on a near-transparent background tint, so blur isn't entirely without precedent — but this component is the first to use it as a genuine floating glass panel over live content (not a static section background). Confirmed with the user: this stays scoped to the TOC component; it does not become a new default anywhere else on the site.
- **Heading IDs — resolved, no new dependency.** `@mdx-js/mdx@3.1.1`'s `evaluate()` (used in `page.tsx`) accepts the same `rehypePlugins` option as `compile()` (confirmed by reading the installed package's own `EvaluateOptions` type, which is `CompileOptions` minus a few JSX-only fields) — so `rehype-slug` would work if installed. Decision: **do not install it.** Every H2 on this page is already hand-authored directly in the `.mdx` body with an explicit `className` prop (e.g. `<h2 className="text-left">Architecture</h2>`) — there are only 4 of them, on one page. Adding a plain `id="..."` attribute by hand to each is zero new dependencies and consistent with how these headings are already written. IDs must be the **same literal string in both the `en` and `it` `.mdx` files** (IDs are not translated; only the heading text is) so the component's logic doesn't need to know about locale.
- **Base UI `Drawer` — no custom bottom sheet needed.** `@base-ui/react@1.7.0` (already installed, already the site's primitives library) ships a full `Drawer` component (`@base-ui/react/drawer`) purpose-built for swipeable bottom sheets: `Root/Trigger/Portal/Backdrop/Viewport/Popup/Content/Title/Close`, `swipeDirection` defaults to `"down"`, built-in `data-starting-style`/`data-ending-style` attributes drive the slide transition (so "no mount/unmount, just translate" is native behavior, not something to hand-build), handles focus/aria/scroll-lock. Use it for the mobile bottom sheet — confirmed via the installed package's own bundled docs. No new dependency.
- **Data source — read from the DOM, not a new content field.** The TOC's items (`{id, label}`) are read client-side from the rendered `<h2 id="...">` elements inside the page's MDX content area (`document.querySelectorAll` scoped to a ref on the content wrapper, same direct-DOM-query technique already used by `components/nav.tsx`'s scroll-spy). This means labels are automatically correct per locale (the rendered heading text) without adding any new field to `ProjectMeta`, `lib/content.ts`, or a parallel translated list that could drift from the real headings.
- **Shared state, two render trees.** One component, `components/toc.tsx`, `'use client'`. A single `activeId` (from one shared `IntersectionObserver`, same rootMargin-band technique as `nav.tsx`'s `-40% 0px -55% 0px`) and a single `open` boolean (desktop: expanded panel vs. collapsed tab; mobile: bottom sheet open vs. closed) are computed once at the top and consumed by two conditionally-rendered JSX blocks — `<div className="hidden lg:block">...desktop...</div>` and `<div className="lg:hidden">...mobile...</div>` — both always mounted, toggled via CSS only (same `hidden lg:*` / `lg:hidden` technique already used throughout the site for structural breakpoint switches, e.g. `experience-timeline.tsx`).
- **Desktop open/close trigger — assistant default, flag if wrong.** The brief doesn't specify what expands the collapsed tab. Defaulting to **click-to-toggle** (click tab to open, click outside or `Escape` to close), matching the site's existing precedent for this exact kind of expand/collapse interaction (`SectionImage`'s lightbox, `Nav`'s mobile hamburger panel) — not hover, which isn't used anywhere else on the site and doesn't work on touchscreens. Logged as a non-blocking open question below.
- **Desktop show/hide (fade + slide-in, shrink near footer) — judgment call on exact thresholds.** Two sentinel elements (plain empty `<div>`s, not visible) mark where the TOC should appear/disappear: one placed right after the page header (`<h1>`/tagline block), one placed right before `<Footer />`. Two more `IntersectionObserver`s (or one shared one observing both) toggle a `visible` boolean: `visible = true` once the top sentinel has scrolled past the top of the viewport (user has started reading the body) AND the bottom sentinel hasn't yet entered the viewport (user hasn't reached the footer yet). This reuses the same sentinel-based technique already established in `nav.tsx`'s "Contacts bolds at the bottom" fix (09e follow-up) rather than inventing a new one. Exact fade/slide timing (`transition-opacity`/`transition-transform`, 200ms per `ui_context.md`'s standard) and the tab's exact fixed position (`left-[clamp(0.5rem,1.5vw,1.5rem)] top-1/2 -translate-y-1/2`, vertically centered) are reasonable defaults, not measured against any mockup (none exists for this component) — flagged as non-blocking, adjust once seen rendered.
- **Desktop closed-tab width at 1280–1366px — must be visually verified, not just assumed.** The tab is `position: fixed` (not part of the document flow), so by construction it never competes for the text column's width, at any viewport — but at narrower laptop widths the page's own fluid edge padding (`px-[clamp(1.5rem,4vw,6rem)]`) may be small enough that the tab, sitting inside that padding at `left-[clamp(...)]`, is close to or slightly overlapping the content's own left edge. This must be checked in the browser specifically in the 1280–1366px range (the same range that caused unit 04's sticky-nav bug) — logged as a required visual check in "Check When Done", not something to solve analytically here.
- **Mobile bottom sheet content is the same TOC items list as desktop** (same `id`/`label` pairs, same active-item bolding) — no separate data source.
- No changes to `Nav`, `Footer`, `SectionImage`, `Callout`, `FlowDiagram`, `LegendBox`, or any homepage section — this unit only adds a new component and wires it into the Project Detail Page.

---

## Design

No mockup exists for this component (confirmed with the user) — behavior and layout are as specified in the user's own brief, reproduced and organized below. Colors reuse existing tokens only (no new `--color-*` token) — active-item emphasis is **bold + a small rightward nudge**, explicitly **not a color change** (per the brief).

### Desktop (`lg:` and up)

1. **Collapsed state (default until scrolled)**: a slim vertical tab, fixed to the viewport's left edge (`fixed left-[clamp(0.5rem,1.5vw,1.5rem)] top-1/2 -translate-y-1/2`), not reserving any layout space. Not visible on initial load — fades + slides in once the user scrolls past the page header (see sentinel logic above), and fades out again near the footer.
2. **Expanded state (click to open)**: the same element grows into an overlay panel — `position: fixed`, sits **on top of** the content (`z-index` above the page body, below any modal), does **not** push or resize the text column. Contains:
   - A small uppercase overline: "In this guide" / translated equivalent (new i18n key).
   - Below it, a numbered list of clickable items, one per page `<h2 id>` — each a `<a href="#{id}">` (native in-page anchor scroll, `scroll-behavior: smooth` — confirm this is already set globally or add it, see Implementation).
   - The active item (per the shared `IntersectionObserver`): `font-bold` + a small `translate-x` nudge to the right. No color change on the active item.
3. **Visual treatment**: translucent/blurred background (`backdrop-blur-md bg-background/70` or similar — exact opacity/blur strength a judgment call, tune once rendered), rounded corners consistent with the site's pill-adjacent radius conventions for small floating elements (not the sitewide `9999px` pill — same category of exception already used for the mobile nav panel/hero collage, `rounded-[20px]`-ish).
4. Click outside the expanded panel, or `Escape`, collapses it back to the tab (same interaction category as `SectionImage`'s lightbox).

### Mobile (below `lg`)

1. **Floating bottom bar**: fixed to the bottom of the viewport (`fixed inset-x-0 bottom-0`), glass treatment (`backdrop-blur`, slightly transparent background), floats above content while scrolling — same visibility rule as desktop (appears after initial scroll, hides near the footer).
2. **Bar layout**, three zones:
   - Left: a small list icon (`lucide-react`, already a dependency) + "In this guide" label.
   - Center: the current active section's label (from the same `activeId`/items list as desktop).
   - Right: an up-arrow button, distinct tap target, scrolls to top (`window.scrollTo({ top: 0, behavior: "smooth" })`) — does **not** open the sheet.
3. **Tap the left/center zone** → opens a bottom sheet (`@base-ui/react/drawer`, `swipeDirection="down"`, i.e. the default): `Drawer.Backdrop` (darkened background), `Drawer.Popup` styled as a white, top-rounded sheet sliding up from the bottom, `Drawer.Content` holding the same items list as desktop (numbered, active item bold, scrollable if it overflows), a small drag handle at the top (plain styled `<div>`, same pattern as Base UI's own documented example), and an explicit close affordance at the top of the sheet (per the brief: "freccia in alto" — an up-arrow/close icon button, separate from the backdrop-tap-to-close which Base UI's `Drawer` already provides by default).
4. The slide-open/slide-closed animation is Base UI's own built-in transform transition (`data-starting-style`/`data-ending-style`, see Architecture section) — no custom mount/unmount logic needed.

---

## Implementation

1. Add `id="..."` attributes to the 4 existing `<h2>` elements in **both** `content/projects/en/remote-nif.mdx` and `content/projects/it/remote-nif.mdx` — same literal ID string in both locale files (e.g. `id="end-to-end-flow"`, `id="architecture"`, `id="the-process"`, `id="stripe-case-study"`). No other change to these files.

2. Confirm (or add, if missing) `scroll-behavior: smooth` in `app/globals.css` for in-page anchor navigation (`href="#id"` clicks) to animate rather than jump — check whether this is already set globally before adding it again.

3. Create `components/toc.tsx` (`'use client'`):
   - On mount, query all `h2[id]` elements inside the project content area (scoped via a ref passed down or a stable container selector — do not query the whole `document`, to avoid ever picking up a heading from `Nav`/`Footer`) and build the `{id, label}` items list from their `textContent`.
   - One shared `IntersectionObserver` (same rootMargin-band technique as `nav.tsx`) sets `activeId` to whichever observed `h2` is currently in the tracking band.
   - Two sentinel-based visibility checks (top-of-content sentinel, pre-footer sentinel — see Architecture) drive a `visible` boolean.
   - One `open` boolean (desktop expand/collapse, mobile sheet open/closed) — click-to-toggle on desktop (with outside-click/Escape to close), Base UI `Drawer`'s own `open`/`onOpenChange` on mobile, both backed by the same state.
   - Renders the two conditional trees described in Design (`hidden lg:block` desktop tab/panel, `lg:hidden` mobile bar + `Drawer`).

4. `app/[locale]/project/[slug]/page.tsx`: render `<Toc />` once (position is `fixed`, so placement in the JSX tree only matters for the content-area ref/selector it scopes its `querySelectorAll` to — pass the same wrapping `<div>` that already holds `<MDXContent .../>` as that scope, e.g. via a `ref` or a stable `id`/`data-` attribute on that div).

5. `messages/en.json` / `it.json`: add a new `toc.*` namespace — `inThisGuide` (overline/bar label), `backToTop` (aria-label for the mobile up-arrow), `close` (aria-label for the bottom sheet's close affordance).

6. Update `context/architecture_context.md`'s "Deciso" section with a new, dated entry recording this reversal (interactive TOC, `use client`, scoped `backdrop-blur`, Base UI `Drawer` for the mobile sheet) — per the Architecture section above, this must not happen silently.

---

## Dependencies

None — `@base-ui/react` (`Drawer`) and `lucide-react` (list/up-arrow icons) are already installed.

---

## Scope Limits

- Only the Project Detail Page (`remote-nif`, and generically any future project page) — not the homepage, which keeps its own existing `Nav` scroll-spy unchanged.
- Don't add `rehype-slug` or any other new remark/rehype plugin — heading IDs are hand-authored, per the Architecture section's decision.
- Don't change `Nav`, `Footer`, `SectionImage`, `Callout`, `FlowDiagram`, `LegendBox`, or any homepage section.
- Don't introduce `backdrop-blur`/glassmorphism anywhere else on the site — scoped to this component only.
- Don't build a custom bottom-sheet/drawer implementation — use `@base-ui/react/drawer` as-is (unstyled primitives, site's own Tailwind classes for appearance).
- Don't add snap points, nested drawers, or any `Drawer` feature beyond a single-level bottom sheet — those exist in the installed library but aren't needed here.

---

## Check When Done

- On `/en/project/remote-nif` and `/it/project/remote-nif`, the desktop TOC tab is hidden at the very top of the page, fades/slides in after scrolling into the body content, and fades out again once the footer is reached.
- Clicking the collapsed tab expands it into a panel listing all 4 section headings (in the current locale's real text, not hardcoded); clicking a link scrolls to that section; the currently active section's item is bold and nudged right, no other items are.
- Clicking outside the expanded panel, or pressing `Escape`, collapses it back to the tab.
- **Verified specifically at 1280–1366px viewport width**: the collapsed tab does not visually overlap the page's text content.
- Below `lg`, the floating bottom bar shows the list icon + "In this guide" on the left, the active section's label in the center, and an up-arrow on the right that scrolls to top without opening the sheet; tapping the left/center zone opens a bottom sheet (Base UI `Drawer`) listing the same 4 sections, with a visible drag handle, a darkened backdrop, and a close affordance at the top of the sheet; tapping the backdrop or the close affordance closes it.
- No `backdrop-blur`/glass styling appears anywhere else on the site as a side effect of this unit.
- `npm run build` passes.

---

## Open Questions (non-blocking, must resolve before this unit is marked done)

- Desktop open/close trigger (click-to-toggle) is an assistant default — the brief didn't specify; confirm or correct once rendered (hover was considered and rejected as inconsistent with the site's existing click-based expand/collapse precedent and touch devices).
- Exact fade-in/shrink scroll thresholds (top sentinel position, distance before the footer) are judgment calls, not measured against a mockup — tune once seen rendered.
- Exact desktop panel position (`left-[clamp(0.5rem,1.5vw,1.5rem)] top-1/2 -translate-y-1/2`), blur strength, and corner radius are assistant defaults with no mockup to check against.
- Whether the mobile bottom bar should also hide near the footer (mirroring desktop) or stay visible throughout is inferred by symmetry with desktop, not explicitly stated in the brief — confirm.
