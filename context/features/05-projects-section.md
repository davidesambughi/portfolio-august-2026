<!-- Read before starting: AGENT.md, context/architecture_context.md, context/ui_context.md, context/user_flows.md -->

# 05 — Projects Section

Build the homepage Projects section: a card grid reading from the content layer (`lib/content.ts`), with a static "Coming soon" filler card when there are fewer than 3 real projects, wired into `app/[locale]/page.tsx` after the Nav.

---

## Architecture, rules and constraints

- Reference mockup: `public/images/project-portfolio.png`. Section heading ("Lorem Ipsum docet" in the mockup) + short subheading above the grid, badge above each card's title, bold headline, short description below.
- Server Component (static, data-driven from the filesystem via `lib/content.ts` — no interactivity needed for the grid itself).
- Data source: `getProjects(locale)` from `lib/content.ts` (already built in unit 03). Returns `ProjectMeta[]` — no new content-layer function needed.
- Card composition uses shadcn/ui's `Card` (`CardHeader`, `CardTitle`, `CardDescription`, `CardContent`) — not yet installed, must be added via the shadcn CLI. Confirmed against current (August 2026) shadcn docs: Base UI is the project's default (`architecture_context.md` — already decided, `-b base`), Card ships as 6 named sub-component exports, `size` prop is `"default" | "sm"`.
- Badge above each card title uses shadcn/ui's `Badge` (not yet installed) styled with the project's `accentColor` field (`ProjectMeta.accentColor`, one of `blue | red | yellow | green` from `types/project.ts`) — decorative only, no semantic meaning, per `ui_context.md`. Map `accentColor` to a **static, literal** class string per color (e.g. `"bg-accent-blue text-on-accent"`), not a template-interpolated class (`` `bg-accent-${color}` ``) — Tailwind's JIT scanner only picks up literal class strings, an interpolated one gets purged from the production build.
- Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` — a structural layout change (column count), not a fluid value, consistent with unit 04's precedent that only the layout switch itself stays a discrete breakpoint while spacing/typography inside it stays `clamp()`-based. Verify current Tailwind v4 grid utilities against the official docs before implementing (per `AGENTS.md`).
- Card cover image: render `coverImage` (a public-folder path string from frontmatter) via `next/image`, `fill` inside an `aspect-[]` wrapper sized to a plausible screenshot ratio (e.g. `aspect-[16/10]`), with `object-cover` and a `bg-muted` background behind it. The current placeholder project's `coverImage` path (`/images/projects/example-project/cover.png`) does not point to a real file yet (per unit 04's progress notes) — this will 404 at request time (not a build error, since the string path isn't statically validated). The `bg-muted` background is a deliberate low-effort fallback so a missing image still reads as a neutral placeholder box rather than a broken-image icon on white. A real broken-image handling strategy (client-side `onError`) is explicitly out of scope here — see Scope Limits.
- Whole card links to `/${locale}/project/${slug}` (the Project Detail Page route, built in unit 09). The route doesn't exist yet — same precedent as unit 04's nav anchors: the link is wired now, it will 404 until unit 09 exists, this is expected and not a bug.
- "Coming soon" filler card: **user decision** — when `getProjects(locale).length < 3`, render `3 - realCount` static filler cards to always fill a 3-card row. Filler card is not a `Link` (not clickable), has no badge/techStack, shows a centered translated "Coming soon" label in the cover area, and uses a neutral/muted style (dashed border, `bg-muted` cover, no accent color) to read as clearly non-interactive/placeholder rather than a real project.
- `techStack` (string array on `ProjectMeta`) renders as a row of small `Badge` elements (`variant="secondary"`, not the accent color — accent is reserved for the one "category" badge per Design, avoid two competing badge styles in the same card).

---

## Design

Based on `ui_context.md` plus `public/images/project-portfolio.png`.

- Section wrapped in `<section id="projects">`, using the same fluid outer container as Hero/Nav (`max-w-[1800px]`, fluid `clamp()` horizontal padding) per `ui_context.md`'s global container rule.
- Heading + short subheading, centered, above the grid (`--color-heading` bold / `--color-body` regular) — real copy not available yet, use a short plausible placeholder sentence per locale (same approach as Hero's `body` in unit 04) and log it as a non-blocking open question in `progress_tracker.md`.
- Grid of cards, 3 columns desktop / 2 tablet / 1 mobile (see Architecture). Card: cover image area (top), then badge, bold title, short description (`CardHeader`/`CardContent`), pill radius on the card itself and on the cover image's corners (global `--radius: 9999px` clipping rule from `ui_context.md` — use an explicit moderate `rounded-[Npx]` here instead if the pill radius visually distorts the card, per the lesson logged in unit 04's progress notes about non-pill-shaped elements).
- Card hover: light zoom (`scale`) per `ui_context.md`'s interaction table ("Card progetti → Leggero zoom"), 200ms `transition-transform`. Filler card has no hover effect (not interactive).
- techStack badges: small, `variant="secondary"`, wrapped in a `flex flex-wrap gap-1.5` row.

---

## Implementation

1. Install shadcn components: `npx shadcn@latest add card badge` (confirm CLI still uses `npx shadcn@latest` and not a renamed/relocated command per current docs before running).

2. Add `projects` keys to `messages/en.json` and `messages/it.json`:
   - `heading`, `subheading` (short placeholder sentence, distinct wording per locale), `comingSoon` (label for filler cards).

3. Create `components/projects-section.tsx` (Server Component, `async`, `getTranslations("projects")` from `next-intl/server`, plus a `locale` param or `getLocale()` for `getProjects(locale)`):
   - Reads `getProjects(locale)` from `lib/content.ts`.
   - Renders the heading/subheading, then the grid.
   - Maps real projects to `Card` elements (cover image, accent badge, title, description, techStack badges, whole-card `Link` to `/${locale}/project/${slug}`).
   - Appends `3 - projects.length` filler "Coming soon" cards when that value is positive.

4. Wire `<ProjectsSection />` into `app/[locale]/page.tsx`, after `<Nav />`, replacing the `{/* Projects, ... */}` placeholder comment.

---

## Dependencies

Install: `card` and `badge` shadcn/ui components (via `npx shadcn@latest add card badge` — adds `components/ui/card.tsx` and `components/ui/badge.tsx`, no new npm packages beyond what shadcn's CLI itself pulls in).

---

## Scope Limits

- No Education/Experience/Tech Stack/About/Contacts sections — units 06–08.
- No Project Detail Page — unit 09. Card links will 404 until then.
- No real project images — cover image renders whatever `coverImage` path is in the frontmatter today (still a placeholder path); no new image assets added in this unit.
- No client-side broken-image fallback (`onError` swap) — only the passive `bg-muted` background fallback described in Architecture. Revisit if this proves insufficient once real projects/images exist.
- No final section heading/subheading copy — placeholder text, logged as open question in `progress_tracker.md` (same pattern as Hero's body copy in unit 04).
- Keep this focused on: the Projects section component and its wiring into the homepage.

---

## Check When Done

- `components/projects-section.tsx` exists, renders without errors in both `/en` and `/it`.
- Grid shows 3 columns on desktop widths, 2 on tablet, 1 on mobile.
- The one existing placeholder project (`example-project`) renders as a real card with its `techStack` badges and accent-colored category badge.
- Exactly 2 filler "Coming soon" cards render alongside it (3 total), non-clickable, visually distinct (muted/dashed) from the real card.
- Card links point to `/${locale}/project/example-project` (404 expected until unit 09 — verify the link href is correct, not that it resolves).
- `messages/en.json` and `messages/it.json` contain no hardcoded UI strings left in the component.
- `progress_tracker.md` updated with the open question about final Projects heading/subheading copy.
- `npm run build` passes.
