<!-- Read before starting: AGENT.md, context/architecture_context.md, context/ui_context.md, context/user_flows.md -->

# 06 — Education Section

Build the homepage Education section: an interactive selector list reading from `content/data/education.ts` — clicking an entry highlights it and reveals its description, with a placeholder visual panel on desktop that reflects the selected entry — wired into `app/[locale]/page.tsx` after the Projects section.

---

## Architecture, rules and constraints

- Reference mockup: `public/images/education-portoflio.png`.
- **User decision:** build the interactive selector shown in the mockup, not a static list. Requires client-side state → `'use client'` component (small leaf component, per `architecture_context.md`'s "'use client' only where real interactivity is needed" — same precedent as the Nav in unit 04).
- Data source: `getEducation()` from `lib/content.ts` (already built in unit 03, sorted most-recent-first, `endDate: null` = ongoing sorts first). No new content-layer function needed.
- No institution logo image assets exist for any education entry. The mockup's left visual panel ("imagine sketch style o logo in base a titolo selezionato") is satisfied **without inventing image assets**: the panel shows the selected entry's `institution` name as large centered text on a flat colored background, swapping when the selection changes. This is a deliberate substitution — flag to the user during/after implementation in case a real logo/illustration approach is wanted later.
- `degree` and `description` are localized objects (`{ en, it }` on `types/education.ts`) — read via the active locale (`useLocale()` from `next-intl`, since this is a Client Component). `description` is optional on `Education` — the PTE Academic entry has none; when absent, the expanded state shows nothing below the date/location line, not an empty gap or "no description" text.
- Two-column layout desktop (`lg:` and up, matching the breakpoint lesson from unit 04 — `md:` left a squished tablet range for two-column layouts): left placeholder panel, right vertical list. Below `lg`: single column, panel above list (same stacking order precedent as Hero).
- Selected state: first entry (`getEducation()[0]`, i.e. most recent) selected by default (`useState` initialized to its `id`).
- Styling for selected vs. unselected list items must follow `ui_context.md` tokens: selected = `--color-accent-blue` left border + `--color-heading` title + secondary details in `--color-body`; unselected = thin `--color-body`/muted border, `--color-subheading` or muted title color, no details shown. 200ms `transition-colors` on the state change per `ui_context.md`'s interaction table.
- Clicking an already-selected item does nothing (no collapse-to-none state — the mockup and PRD's "compact, scannable" goal don't call for an empty state here).

**Decisions confirmed with user (2026-08-07), resolving mockup ambiguities before implementation — see `feedback-mockup-fidelity` memory:**
1. **Panel color:** solid `bg-accent-blue` (full saturation, matching the token's other decorative uses — badge, buttons), not a lightened/pastel tint. The mockup's pale cyan was a mockup rendering choice, not a spec to match exactly. Panel text uses `--color-on-accent` (white) for contrast on the solid blue, per `ui_context.md`'s "text on accent" rule.
2. **List item title line:** `institution — degree` combined (e.g. "ITS Marche — Full-Stack Software Developer e Cloud Specialist"), not institution or degree alone.
3. **Dates, location, description:** the mockup's lorem ipsum placeholder text under the selected item stands in for date range + description (confirmed by user — "il mockup mostra lorem ipsum... perché li inseriremo date, voto e descrizione"; "voto"/grade is not a separate data field, it's already embedded in the `description` text for the one entry that has it, e.g. ITS Marche's "Final grade: 110/110."). **Assistant's call, flagged for correction if wrong:** location is included on the same line as the date range (`location · startDate – endDate`), matching the pattern already established for the Experience mockup (`public/images/experience-portfolio.png`, "Company Name, Location / Month 20XX - month 20XX") since `Education` and `Experience` share the same `location?`/`startDate`/`endDate` shape. All three (date/location line + description) are revealed only when an item is selected, alongside the always-visible title line.
4. **Panel height:** stretches to match the list's rendered height (not a fixed aspect-ratio box) — implement via a `lg:items-stretch` flex/grid row so both columns share the same height, whatever that height ends up being for the current 3 entries.

---

## Design

Based on `ui_context.md` plus `public/images/education-portoflio.png`.

- Section wrapped in `<section id="education">`, same fluid outer container (`max-w-[1800px]`, fluid padding) as the rest of the page.
- Heading ("Education") + short subheading, centered, above the two-column block — real copy not available yet, short placeholder sentence per locale, logged as open question in `progress_tracker.md` (same pattern as Hero/Projects).
- Left panel: rounded rectangle (moderate `rounded-[Npx]`, not the global pill radius — same exception logged in unit 04 for non-pill-shaped elements), solid `bg-accent-blue` background, selected institution's name centered inside, bold, `text-on-accent`. Height matches the list column's height (`lg:items-stretch` on the shared row), width fixed/moderate (mockup ratio is roughly a narrow portrait rectangle — implement close to that proportion at the row height it ends up with, not a hardcoded aspect ratio).
- Right list: vertical stack of entries, top to bottom, most-recent-first order (matches `getEducation()`'s existing sort). Each item: `institution — degree` as the always-visible title line; when selected, reveals a `location · startDate – endDate` line (formatted human-readable, `endDate: null` → translated "Present"/"Presente") and the `description` (when present); left border accent marking the selected item per the mockup.
- Mobile (`< lg`): panel stacks above the list, full width, a fixed reasonable height (it can't "match the list's height" when stacked above it) — list items keep the same click-to-expand behavior.

---

## Implementation

1. Add `education` keys to `messages/en.json` and `messages/it.json`:
   - `heading`, `subheading` (short placeholder sentence, distinct wording per locale), `present` (translated label for an ongoing `endDate: null` entry — none of the current 3 entries need it, but the type allows it).

2. Create `components/education-section.tsx` (`'use client'`):
   - `useTranslations("education")` for heading/subheading, `useLocale()` for reading `degree`/`description`.
   - Calls `getEducation()` — since `lib/content.ts` uses `node:fs`/`node:path`, this must run at build/render time in a way compatible with Client Components: either call it in a Server Component wrapper and pass the result down as a prop, or (simpler, matches "small leaf client component" precedent) fetch it in a small Server Component parent (`components/education-section.tsx` stays server, delegates the interactive list to a nested `'use client'` sub-component, e.g. `components/education-list.tsx`, passed `education: Education[]` as a prop). Choose the parent/child split — do not call `node:fs` APIs from inside a `'use client'` module.
   - `useState<string>` for the selected entry's `id`, defaulting to `getEducation()[0].id`.
   - Renders the two-column layout: placeholder panel (selected institution name) + clickable list.

3. Wire `<EducationSection />` into `app/[locale]/page.tsx`, after `<ProjectsSection />`.

---

## Dependencies

None — no new shadcn primitives or npm packages required (plain `useState`, existing tokens/typography).

---

## Scope Limits

- No Projects/Experience/Tech Stack/About/Contacts sections — units 05, 07, 08.
- No real institution logo/illustration assets — text-on-color-background substitution only, per Architecture.
- No collapse-to-none interaction (an item is always selected).
- No final section heading/subheading copy — placeholder text, logged as open question in `progress_tracker.md`.
- Keep this focused on: the Education section component(s) and its wiring into the homepage.

---

## Check When Done

- `components/education-section.tsx` (and, if split, `components/education-list.tsx`) exist, render without errors in both `/en` and `/it`.
- All 3 entries from `content/data/education.ts` render in the list, most-recent-first.
- Clicking a list item updates the selected state: left border + title color change to the selected entry, `location · date range` line and description (when present) appear; the previously selected item collapses back to its unselected style.
- The PTE Academic entry (no `description`) shows the date/location line but no description text when selected, and no visible empty gap where the description would be.
- Left panel text matches the currently selected entry's `institution` and updates on click.
- Two-column layout only from `lg` up; single column (panel above list) below `lg`.
- No `node:fs` import inside any `'use client'` module.
- `progress_tracker.md` updated with the open question about final Education heading/subheading copy.
- `npm run build` passes.
