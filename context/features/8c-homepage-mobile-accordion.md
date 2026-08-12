## This file has to be written precisely, clearly , and concisely. Do not add , assume or invent, but ask for more information if you need it .

# 8c — Homepage Mobile Accordion

<!-- Read before starting: AGENTS.md, ui_context.md, architecture_context.md, user_flows.md, progress_tracker.md (Open Questions, entry dated 2026-08-12 — both blocking points below are resolved by this spec). -->

On mobile (below the `lg` breakpoint), collapse Projects/Education/Experience/Skills/About into independently expandable/collapsible sections — closed by default — while desktop keeps today's always-expanded layout completely unchanged.

---

## Architecture, rules and constraints

**Scope of "collapsible"**: Projects, Education, Experience, Skills, About only.

- **Hero**: excluded — always visible, never collapsible (explicit user decision).
- **Contacts/Footer**: excluded — stays always visible on mobile, unchanged. It has no `<h2>` heading (unit 8b: "questo è un footer", only a "Follow Me" row), so it has no natural tap-target for a trigger, and the user confirmed it should not gain one just for this feature.
- **Project Detail Page TOC (09g)**: separate system, not touched by this unit.

**Two decisions resolved with the user for this spec** (both were blocking, per `progress_tracker.md` Open Questions):

1. **Multi-apertura indipendente** — not an exclusive/Wikipedia-style accordion. Any number of the five sections can be open at once; opening one does not close another.
2. **Stato iniziale: tutte chiuse.** The user was shown the tension with the PRD goal ("recruiter capisce il profilo in <1 minuto") and confirmed closed-by-default anyway. Not re-litigated here.

**Breakpoint**: reuse the site's existing structural breakpoint (`lg`, 1024px) — the same one already used for every other mobile/desktop structural switch (Experience's timeline vs. stacked list, Hero's/About's `flex-col` vs `lg:flex-row`, etc., per `ui_context.md`). No new threshold.

**Desktop must be unaffected.** At `lg` and above: no trigger, no chevron, no collapse/expand behavior, sections always fully rendered exactly as today. This must hold both visually and in the DOM/behavior (existing Nav scroll-spy for desktop untouched).

**No JS-based breakpoint detection.** Per this project's established convention (CSS-driven responsive behavior, no `matchMedia`/`window.innerWidth` checks used anywhere else in the codebase), the mobile/desktop split for the accordion must be achieved with CSS, not a runtime viewport check:

- The five sections' `<Accordion.Panel>` must render with `keepMounted` (so its content stays in the DOM even while logically "closed" on mobile, instead of unmounting) and a `lg:!block` (or equivalent) override class, so that whatever hidden/closed styling Base UI applies below `lg` is forced back to visible at `lg`+, regardless of the accordion's `value` state. Verify against the installed `@base-ui/react` Accordion docs/source before implementing exactly which attribute/style Base UI uses for the closed state (`hidden` attribute vs. inline height), per `AGENT.md`'s doc-check rule — this primitive hasn't been used for animated height before (09g used Drawer, a different sub-part).
- Each section's heading renders **twice** in the markup, toggled by CSS, matching the exact precedent already used for Experience's desktop-timeline-vs-mobile-list split ("both always render server-side, toggled via `hidden lg:grid` / `lg:hidden` CSS, not conditionally mounted" — unit 07): a plain static `<h2>` (today's exact markup/classes) shown `hidden lg:block`, and an interactive `<Accordion.Trigger>` wrapping the same heading text + a chevron icon, shown `lg:hidden`. The body content itself is **not** duplicated — only the heading/trigger differs by breakpoint.

**Dependency**: `@base-ui/react` (already installed, already used for `Drawer` in 09g and `dropdown-menu` in 09i) ships an `Accordion` primitive (`Root`, `Item`, `Header`, `Trigger`, `Panel`) with a `multiple` prop for independent multi-open and a controlled `value`/`onValueChange` API. No new package.

**Heading level**: `Accordion.Header` renders an `<h3>` by default (confirmed against the installed package's own `AccordionHeader.d.ts`/`.js` — `useRenderElement('h3', ...)`), not an `<h2>`. Since the desktop-only static heading (step 4 below) stays a plain `<h2>` (today's exact markup), `Accordion.Header` must be given an explicit `render={<h2 />}` so the mobile trigger's heading is also an `<h2>` — otherwise the same section would expose an `<h2>` on desktop and an `<h3>` on mobile, breaking the page's heading hierarchy (a11y/SEO) depending on viewport.

**Shared state across Nav and sections**: Nav (`components/nav.tsx`) and the five section components are siblings in `app/[locale]/page.tsx`, not nested — but the mobile hamburger panel needs to both read which sections are open (to bold the matching nav item) and write to it (tapping a nav item opens the corresponding section). This requires one shared piece of client state above both. A single `Accordion.Root` must also wrap all five sections together (not five independent roots) so that "multi-open across different sections" is one shared state, not per-section state.

- New Client Component wraps `<Nav />` and the five sections in `app/[locale]/page.tsx`: holds `openSections` (`string[]`) via `useState`, exposes it through a small React Context (consumed by `Nav`), and renders `@base-ui/react`'s `<Accordion.Root value={openSections} onValueChange={setOpenSections} multiple keepMounted>` around the five section components. The Root's own wrapper element must not affect layout (e.g. rendered with `className="contents"`) since the five sections rely on normal document flow, not flex-item sizing, inside `<main>`.
- Each of the five section components renders `<Accordion.Item value={id}>` at its root (id = the same string used as the section's `id` attribute / Nav anchor: `"projects"`, `"education"`, `"experience"`, `"skills"`, `"about"`) instead of a plain `<section id="...">` — the actual `<section>` tag and its existing background/spacing classes move onto `Accordion.Item`'s rendered element (Base UI parts accept a `render`/`className` pass-through — confirm the exact prop against the installed package before implementing).

**Nav is also reused, unwrapped, on the Project Detail Page** (`app/[locale]/project/[slug]/page.tsx`, per unit 09e) — that page has no accordion shell. The Context hook must not throw when used there; it returns `null` outside a `MobileAccordionShell`, and `Nav` falls back to plain link behavior for the five accordion anchors in that case (same as today — `/#anchor`, closes the panel, no accordion state touched).

**Nav integration** (`components/nav.tsx`):

- **Desktop link row** (`hidden md:flex`, plus the top-level `NAV_ITEMS.map` used there): **zero changes**. Same `<Link href="/#anchor">`, same `activeAnchor` scroll-spy bolding, same `IntersectionObserver` effect — untouched.
- **Mobile hamburger panel** (`#mobile-nav-panel`): for the five accordion items only, replace the current bare anchor click with: ensure the section's id is included in `openSections` (if not already — nav always **opens**, never toggles a section closed; closing stays the section's own trigger's job), close the hamburger panel (existing `setOpen(false)`, unchanged), then scroll the section into view once its expand transition has had a chance to run (the click must not scroll against the old, collapsed layout). For "home" and "contacts" — excluded from the accordion — the mobile panel keeps its exact current behavior (plain anchor link, `setOpen(false)`, no accordion involvement).
- **Mobile active-item bolding**: the existing `activeAnchor` (IntersectionObserver-driven) value keeps being computed exactly as today, for every item — it's still correct and needed for "home"/"contacts". It is simply **not read** for the five accordion items in the mobile panel's rendering; those instead bold when `openSections.includes(anchor)`. This is a narrower, lower-risk change than replacing the scroll-spy mechanism outright (an idea raised before this spec was written but not adopted): the observer must keep running unconditionally anyway, since desktop still needs it untouched, so it costs nothing to also leave it computing (and simply ignoring) values for mobile's five collapsible items.

**Animation**: expand/collapse must be a smooth height transition, not an instant snap — use Base UI Accordion's own built-in mechanism for this (check current docs/source for the exact API, e.g. a CSS custom property driven by the panel's measured height). Chevron rotation on open/close reuses the site's standard interaction transition (`ui_context.md`: 200ms, default Tailwind easing) — same as every other interactive element site-wide, not a new pattern.

---

## Design

- Mobile trigger row layout: existing heading text (same size/weight/color token as today's `<h2>`) + a chevron icon (`lucide-react`, already a dependency) right-aligned in the row, rotating 180° when the section is open. The whole row is the tap target (Wikipedia-style — the heading itself is the button, not a separate small icon-only control).
- No other visual changes to a section's internal content/spacing when expanded — the accordion only gates visibility of the same body that renders today.
- No new i18n keys required: each trigger reuses that section's existing `heading` translation as its visible label (`projects.heading`, `education.heading`, `experience.heading`, `skills.heading`, `about.heading`). Add an `aria-label`/accessible name only if `Accordion.Trigger`'s default (visible text + native `aria-expanded`) turns out insufficient — verify against Base UI's accessibility docs before adding anything extra.

---

## Implementation

1. Create `components/mobile-accordion-context.tsx` (`'use client'`): a React Context holding `{ openSections: string[]; setOpenSections: (value: string[]) => void }`, plus a `useMobileAccordion()` hook that throws if used outside the provider (matches this codebase's existing style of small, single-purpose client modules — e.g. `language-switcher.tsx`).

2. Create `components/mobile-accordion-shell.tsx` (`'use client'`): holds the `useState<string[]>([])` for `openSections`, provides it via the Context from step 1, and renders `@base-ui/react`'s `<Accordion.Root value={openSections} onValueChange={setOpenSections} multiple keepMounted className="contents">{children}</Accordion.Root>`.

3. In `app/[locale]/page.tsx`, wrap `<Nav />` and the five section components (`<ProjectsSection />`, `<EducationSection />`, `<ExperienceSection />`, `<SkillsSection />`, `<AboutSection />`) in `<MobileAccordionShell>`. `<Hero />` and `<Footer />` stay outside, unchanged.

4. In each of `components/projects-section.tsx`, `components/education-section.tsx`, `components/experience-section.tsx`, `components/skills-section.tsx`, `components/about-section.tsx`:
   - Change the root returned element from `<section id="...">` to `<Accordion.Item value="...">` (same id string as today's `id` attribute), moving the existing `<section>` tag + its classes onto the Item via Base UI's render/className mechanism.
   - Split the existing `<h2>` heading into two renders: the original `<h2>` unchanged except `hidden lg:block` added, and a new `<Accordion.Header render={<h2 />}><Accordion.Trigger>` wrapping the same heading text + chevron icon, classed `lg:hidden` — the explicit `render={<h2 />}` is required so this renders as an `<h2>` and not Base UI's `<h3>` default (see Architecture).
   - Wrap the section's existing body (everything below the heading) in `<Accordion.Panel keepMounted className="hidden lg:!block ...">` (exact open/closed mobile visibility classes driven by Base UI's own state styling — check current docs) so it collapses/expands on mobile and stays permanently visible at `lg`+.

5. In `components/nav.tsx`, update only the mobile hamburger panel block (`#mobile-nav-panel`): import and call `useMobileAccordion()`; for the five accordion anchors, replace the click handler to ensure the anchor is added to `openSections`, close the panel, then scroll the target section into view after its expand transition; keep the "home"/"contacts" items' existing `onClick={() => setOpen(false)}` as-is. Update the bold/active class logic in this block only (not the desktop row) to use `openSections.includes(anchor)` for the five accordion anchors and `activeAnchor === anchor` (unchanged) for "home"/"contacts".

---

## Dependencies

No new dependency — `Accordion` ships in the already-installed `@base-ui/react` package (same package already used for `Drawer` in 09g and `dropdown-menu` in 09i).

---

## Scope Limits

- Does not touch the Project Detail Page TOC (09g) — separate, already-interactive system, not related to this feature.
- Does not touch Hero — stays always visible, never collapsible.
- Does not touch Contacts/Footer — stays always visible on mobile, no new heading/trigger added to it.
- No changes to desktop (`lg`+) markup, styling, or behavior — must remain pixel-identical to today, verified visually before closing this unit.
- No new breakpoint — reuses the existing `lg` (1024px) structural threshold, nothing new added to `ui_context.md`'s breakpoint rules.
- No persistence of open/closed state across reloads or navigation (no `localStorage`/`sessionStorage`) — every fresh page load starts with all five sections closed, per the user's explicit decision.
- No changes to `lib/content.ts` or `content/data/*` — this is a UI/interaction-only unit, no data model changes.
- Does not touch unit 10 (404 & Error/Empty States) — stays a separate, still-pending unit.

---

## Check When Done

- On a viewport below `lg`: Projects, Education, Experience, Skills, About all render closed on first load — only each heading row + chevron is visible, no body content.
- Tapping a closed section's heading row expands it with a smooth height animation (not an instant snap); tapping an open one collapses it. Multiple sections can be open at the same time (verified: opening a second section does not close the first).
- Hero and Contacts/Footer remain fully visible at all times on mobile — no trigger, no collapse, unaffected by this feature.
- On a viewport at `lg` and above: all five sections render fully expanded, no chevron/trigger visible anywhere, and the rendered output is visually identical to the pre-feature state (spot-checked, e.g. via `getBoundingClientRect` comparison or screenshot, same verification style as prior units).
- Mobile hamburger nav panel: tapping "Projects"/"Education"/"Experience"/"Skills"/"About" opens that section if closed (never closes it) and scrolls it into view; the tapped item's label goes bold while its section is open, and un-bolds if the section is later closed via its own trigger.
- Mobile hamburger nav panel: "Home" and "Contacts" behave exactly as before this unit (plain anchor scroll, scroll-spy bolding) — no regression.
- Desktop nav (link row + scroll-spy `IntersectionObserver` effect) is functionally untouched — no code path added or removed there.
- Project Detail Page (`/[locale]/project/[slug]`) still renders and its Nav's mobile hamburger panel still works (plain scroll to `/#anchor`) — no crash from the accordion context being absent there.
- `npm run build` passes.
