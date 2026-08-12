<!-- Read before starting: AGENT.md, context/architecture_context.md, context/ui_context.md, context/user_flows.md -->

# 07 — Experience Section

Build the homepage Experience section: a horizontal timeline on desktop and a vertical timeline on mobile (both with a decorative "Future" node, both expandable per entry), reading from `content/data/experience.ts`, wired into `app/[locale]/page.tsx` after the Education section.

---

## Architecture, rules and constraints

- Reference mockup: `public/images/experience-portfolio.png`.
- Data source: `getExperience()` from `lib/content.ts` (already built in unit 03, sorted most-recent-first). No new content-layer function needed.
- `ui_context.md` / `user_flows.md` requirement (explicit, not a mockup guess): "Experience: timeline orizzontale desktop → stack verticale mobile."
- **Ordering — read carefully, this differs between the two layouts:**
  - **Desktop timeline** reads left-to-right in chronological order (oldest → most recent → decorative "Future" node last), matching the mockup's visual flow. This is the **reverse** of `getExperience()`'s own sort order — reverse the array (`[...getExperience()].reverse()`) before rendering the desktop timeline.
  - **Mobile stack** keeps `getExperience()`'s native most-recent-first order (standard CV reading convention — most recent role first). Do **not** reverse it for mobile.
  - This is a deliberate, explicit call (not left implicit) — flag it to the user during/after implementation in case the intended reading order differs from this reasoning.
- **"Future" node — user decision:** append one static decorative node after the last real (most recent) entry on the desktop timeline. Not part of `content/data/experience.ts`, not data-driven. **Revised (2026-08-07, see below): also included on the mobile timeline**, placed first (above even the newest real entry) since mobile now shares the desktop's timeline graphic and reads most-recent-first.
- **Revised after initial implementation (2026-08-07): this section is interactive, not static.** Every real work entry (desktop timeline node and mobile list item alike) must be expandable/collapsible on click, revealing additional detail — per user request, matching the precedent already set by Education's click-to-expand pattern. Split into `components/experience-section.tsx` (Server Component — `getExperience()`, translations, locale, prepares plain-data `TimelineNode[]` for both layouts) and `components/experience-timeline.tsx` (`'use client'` — owns one shared `Set<string>` of expanded entry ids, toggled by clicking either layout's button; both layouts read the same state so expanding a node is consistent regardless of viewport). The decorative "Future" node stays non-interactive (not a real work entry — renders as a plain `<div>`, not a `<button>`).
- Desktop timeline layout: a central horizontal line with alternating nodes above/below by index parity (even index above, odd index below — matches the mockup), each node connected to the line with a short vertical connector. Implemented as CSS Grid: 3 explicit rows (above-labels / shared-dot-line / below-labels) × N columns (one per node), `gridTemplateRows`/`gridTemplateColumns` set inline since the column count is data-driven (`nodes.length`). **Alignment pitfall hit and fixed during implementation:** the shared line's big dot and each label's small marker dot must share the exact same x-position within their grid column. The first attempt centered the big dot in its (wide, `1fr`) column via `justify-center` while the marker dot was left-anchored inside a narrow sub-box — `justify-center` is a **flex `justify-content`** utility (aligns a container's *children*), not `justify-self` (aligns the *item itself* within its grid cell), so the big dot's wrapper never actually moved from center despite an explicit `w-2.5` width. Fixed by using `justify-self-start` (the correct grid alignment property) on the big-dot wrapper, matching the marker's own left-anchored `w-2.5` box exactly. **Lesson: `justify-content`/`justify-center` and `justify-self`/`justify-self-start` are not interchangeable — the first controls a flex/grid container's children, the second controls where the item sits in its own grid area.** Each node's connector line is a *fixed* length (`h-[clamp(4rem,7vw,6rem)]`), not `flex-1` filling a fixed-height cell — the label+connector group is anchored to the outer edge of its grid row via `justify-end` (above nodes) / `justify-start` (below nodes) on a `flex-col` cell with no explicit height, so the connector always touches the shared line regardless of whether that row's height grew because a *different* node's label expanded (grid rows are equal-height across all columns in the row; the growing node's extra space appears above/below its own label, not as a gap in anyone's connector).
- Breakpoint for the desktop-timeline vs. mobile-timeline switch: `lg` (1024px), consistent with the tablet-squeeze lesson learned in unit 04 (a horizontal timeline needs even more horizontal room per node than the Hero's two-column layout did, so `lg` is the safer floor, not `md`) — confirm against the actual rendered node width during implementation, adjust if `lg` still crowds nodes at the low end of that range.
- **Revised again (2026-08-07, same session): mobile is also a timeline graphic, not a plain list.** Per user request/confirmed decisions: mobile renders a *vertical* timeline — a continuous line running top-to-bottom along the left edge, a colored marker dot per entry on that line, labels to the dot's right — the same visual language as desktop (colored dots, click-to-expand) rotated 90°, not the plain bordered list originally planned. Two things intentionally differ from desktop, both explicit user decisions: (1) mobile keeps the CV-convention most-recent-first order (opposite of desktop's oldest-to-newest), and (2) the "Future" node is included, placed *first* (topmost) since it's chronologically beyond even the newest real entry — this specific placement was the assistant's own call (not explicitly specified by the user), flagged in `progress_tracker.md` in case a different position was intended. Implementation: each `<li>` is a flex row — a narrow marker column (dot, then a `flex-1` line segment continuing down to the *next* item, present on every item except the last) beside the label/button column — no absolute positioning needed, the line is simply each item's own trailing segment, giving one continuous line with no gaps.
- **Marker dot colors — user decision (2026-08-07):** job-title marker dots (small dots at each label, both layouts) cycle through `--color-accent-blue` → `--color-accent-yellow` → `--color-accent-green` → `--color-accent-red` by **chronological position** (not display-order position, since desktop and mobile show entries in different orders) — computed once server-side per entry id so the same job keeps the same color on both layouts. This replaces the earlier "always green" marker color.
- **Connector line color — user decision (2026-08-07):** the line connecting each marker dot to the shared timeline (desktop) / to the next entry (mobile) is `--color-body` (the same dark grey as regular body text), not `--color-accent-green`. Only the big dots on desktop's shared central line, and that line itself, stay `--color-accent-purple` — unchanged.
- `role`/`description` are localized objects (`{ en, it }` on `types/experience.ts`) — read via `getTranslations`/locale from the request (Server Component, so `getLocale()` from `next-intl/server` or the existing locale param pattern already used by Hero).
- Date display: format `startDate`/`endDate` (`"YYYY-MM"` or `"YYYY"`) into a human-readable range (e.g. "Jan 2026 – Jun 2026", "2019 – 2024"), `endDate: null` → "Present" / "Presente" (translated). **Reuse `lib/format-date.ts`'s `formatDateRange`** — already built in unit 06 for Education, do not duplicate it.

**Decisions confirmed with user (2026-08-07), resolving mockup ambiguities before implementation — see `feedback-mockup-fidelity` memory:**
1. **Bold headline field — corrected, not actually ambiguous:** cross-checking the mockup's leftmost label ("Insurance Employee") against `content/data/experience.ts` shows it's literally the `role` value of the Sambughi Assicurazioni entry (the oldest, leftmost on the chronological timeline), not a company name. So the bold headline is **`role`**, not `company`. The label has three lines top to bottom: (1) bold `role` — `--color-heading`; (2) `company, location` — `--color-body`; (3) date range — `--color-body`. The doc's earlier "confirm during implementation" hedge on this is resolved; do not re-litigate it.
2. **Section heading:** follow the mockup exactly — "Experience" as a bold heading, **left-aligned**, **no subheading** underneath. This intentionally breaks from Projects'/Education's centered-heading-plus-subheading pattern, because that's what this specific mockup shows.
3. **Timeline colors:** the mockup's small per-label dots are teal/green → map to `--color-accent-green` (same substitution already used for the Hero collage's teal block). The mockup's big dots on the central line, and the dotted line itself, are **purple** — not a color in our existing palette. User decision: add a new decorative token, `--color-accent-purple`, to `app/globals.css`'s `@theme inline`/`:root` blocks (same pattern as the existing `--color-accent-*` tokens) rather than substituting an existing one. Pick an oklch value visually close to the mockup's purple/violet dots (the mockup doesn't give an exact value — eyeball it, this is a decorative token, not a brand-critical color) and add it to `context/ui_context.md`'s color list too, so the token is documented in the same place as the other four.
4. **"Future" node subtitle:** the mockup shows a second grey line under "Future" (rendered as literal "Lorem ipsum" placeholder in the mockup, i.e. real body text is meant to go there — the doc's earlier assumption of a title-only label was wrong). Add a short placeholder subtitle (e.g. "What's next" / EN, "Cosa succederà" / IT) via a new `experience.futureSubtitle` translation key, explicitly flagged as provisional copy to replace later — same treatment as the section's `heading`/hero `body` placeholders elsewhere in this project.

---

## Design

Based on `ui_context.md` plus `public/images/experience-portfolio.png`.

- Section wrapped in `<section id="experience">`, same fluid outer container (`max-w-[1800px]`, fluid padding) as the rest of the page.
- Heading: "Experience", bold, **left-aligned**, **no subheading** — per the confirmed decision above, deliberately not matching Projects'/Education's centered heading+subheading pattern.
- Desktop timeline: central horizontal dotted line in `--color-accent-purple` (new token, see Architecture). At each entry's x-position: a big solid `--color-accent-purple` dot sits on the line; a short vertical connector in `--color-body` runs from the line up (even index) or down (odd index) to a small marker dot at the label end, colored per the blue/yellow/green/red cycle (see Architecture). Label block (top to bottom): bold `role` (`--color-heading`), `company, location` (`--color-body`), date range (`--color-body`) — three lines, per the confirmed decision above. "Future" node: same dot/connector styling, bold "Future" title, and a second grey subtitle line (`experience.futureSubtitle`, `--color-body`) — no company/location/date lines.
- Mobile timeline: vertical version of the same graphic (see Architecture) — continuous `--color-body` line down the left edge, colored marker dots (same blue/yellow/green/red cycle, same per-entry color as desktop), labels to the right. Most-recent-first order, "Future" node included and placed first. Click-to-expand on every real entry, same as desktop.
- `description` (present on all 3 real entries, unlike Education) — hidden by default on both layouts, revealed on click alongside a temporary lorem ipsum placeholder paragraph (same treatment as Education's expanded state — stands in for longer per-entry detail planned for a later pass, not final copy). Collapsed state shows only title/subtitle/date range; nothing is permanently visible beyond that. Grid rows grow automatically to fit an expanded label (see Architecture) — no manual truncation needed.

---

## Implementation

1. Add the new `--color-accent-purple` token to `app/globals.css` (`@theme inline` + `:root`, same pattern as the existing four `--color-accent-*` tokens) and to `context/ui_context.md`'s color list.

2. Add `experience` keys to `messages/en.json` and `messages/it.json`:
   - `heading` (no `subheading` key — this section doesn't have one, per the confirmed decision), `present` (for ongoing `endDate: null` entries), `futureTitle` (the decorative trailing node's bold title, "Future"/translated), `futureSubtitle` (its second line, e.g. "What's next"/"Cosa succederà" — provisional copy, flag as an open question same as other placeholder copy in this project).

3. Create `components/experience-section.tsx` (Server Component, `async`, `getTranslations("experience")` + locale):
   - Reads `getExperience()`.
   - Renders the left-aligned heading (no subheading).
   - Computes each entry's marker `dotColorClass` once, keyed by chronological position (`sambughi`→blue, `hospitality`→yellow, `InspectOs`→green, `future`→red), so it's stable across both layouts regardless of display order.
   - Builds two plain `TimelineNode[]` arrays (desktop: reversed chronological order + trailing "Future" node; mobile: most-recent-first + leading "Future" node) with already-localized/formatted fields (`title`, `subtitle`, `dateRange`, `description`, `dotColorClass`) — uses `formatDateRange` from `lib/format-date.ts` (built in unit 06), does not reimplement it.
   - Passes both arrays to `<ExperienceTimeline />`.

4. Create `components/experience-timeline.tsx` (`'use client'`):
   - `useState<Set<string>>` for expanded entry ids, one `toggle(id)` function shared by both layouts.
   - Desktop (`hidden lg:grid`): the CSS Grid timeline described in Architecture. Each real node's label is a `<button>` (`aria-expanded`, toggles on click); the "Future" node's label is a plain `<div>` (non-interactive).
   - Mobile (`lg:hidden`): a `<ul>` vertical timeline (see Architecture) — each `<li>` a flex row of [marker column: dot + trailing line segment] + [label, `<button>`-wrapped for real entries, plain `<div>` for "Future"]. Same shared expand state as desktop.

5. Wire `<ExperienceSection />` into `app/[locale]/page.tsx`, after `<EducationSection />`.

---

## Dependencies

None — no new shadcn primitives or npm packages required.

---

## Scope Limits

- No Projects/Education/Tech Stack/About/Contacts sections — units 05, 06, 08.
- No scroll-spy or nav-active-state coupling to this section.
- No final "Future" node subtitle copy — placeholder text (`experience.futureSubtitle`), logged as open question in `progress_tracker.md`. Section `heading` itself is final copy ("Experience", no subheading — not a placeholder).
- "Future" node is static/decorative only — no real data behind it, no link, no interactivity (this is the one exception to the section's expand/collapse behavior).
- No final expanded-state copy — the lorem ipsum placeholder paragraph is provisional, same as Education's, not owned by any unit yet.
- Keep this focused on: the Experience section component and its wiring into the homepage.

---

## Check When Done

- `components/experience-section.tsx` and `components/experience-timeline.tsx` exist, render without errors in both `/en` and `/it`.
- `--color-accent-purple` exists in `app/globals.css` and is documented in `context/ui_context.md`.
- Section heading "Experience" renders left-aligned with no subheading below it.
- Desktop (`≥ lg`): all 3 real entries render left-to-right oldest-to-newest (Sambughi Assicurazioni → hospitality → InspectOs), each label showing bold `role` / `company, location` / date range (three lines), followed by the "Future" node (bold title + subtitle line, not clickable), alternating above/below the central purple line. Small green marker dots line up exactly with the big purple dots on the shared line for every node — verified visually in a browser, not just via HTML/class inspection (see the unit 07 progress-tracker entry on the `justify-content` vs. `justify-self` bug this caught).
- Clicking a real entry's label (desktop or mobile) reveals its `description` + placeholder paragraph and does not visually disturb any other node's alignment or connector, including when the row's grid track grows taller as a result.
- Mobile (`< lg`): a vertical timeline — continuous line, colored marker dots (same per-entry color as desktop), all 3 real entries top-to-bottom most-recent-first with the "Future" node topmost, same click-to-expand behavior as desktop, no gap in the connecting line between items.
- Date ranges render as human-readable text, `endDate: null` shows the translated "Present"/"Presente" label (the current InspectOs entry).
- No layout overlap/crowding at the low end of the desktop range (spot-check widths just above `lg`, per the unit 04 lesson on untested intermediate widths — not just the exact breakpoint value).
- `progress_tracker.md` updated with the open question about the "Future" node's provisional subtitle copy and the expanded-state placeholder paragraph.
- `npm run build` passes.
