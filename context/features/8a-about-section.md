# About

<!-- Read before starting: AGENT.md, context/architecture_context.md, context/ui_context.md, context/user_flows.md, context/progress_tracker.md, context/features/08-skills-about-contacts.md (shared conventions this unit follows: fluid container, clamp() spacing, static/non-interactive Server Component pattern). -->

Build the homepage About section: personal, non-work text on the left and a 3-photo placeholder mosaic on the right, following the site's established two-column layout pattern, wired into `app/[locale]/page.tsx` after `<SkillsSection />`.

---

## Architecture, rules and constraints

- Reference mockup: `public/images/about-portfolio.png` — heading "About Me" + two body paragraphs on the left, a photo mosaic on the right (one large landscape photo on top, two smaller near-square photos side by side below it).
- **Confirmed with user (2026-08-07), resolving the two real content gaps before implementation — do not guess these:**
  1. **Body copy is temporary placeholder text**, not the user's real personal/non-work copy — same treatment as Hero's `body` in unit 04 (see `progress_tracker.md` Open Questions). Logged as a new open question below; no unit currently owns replacing it.
  2. **All 3 photos are temporary flat-color placeholder boxes**, not real images — same treatment as Hero's third (still-undecided) collage slot in unit 04. Logged as a new open question below.
- Layout follows `ui_context.md`'s "Layout — container globale" two-column pattern (text + visual), already used by Hero: text column `lg:w-[46%]`, stacked (`flex-col`, text above visual) below `lg` — same breakpoint and same text-above-visual stacking order Hero already established, for consistency.
- **Revised (2026-08-07, after initial implementation): visual column is not `lg:flex-1`.** Per user feedback after seeing it rendered ("le foto sono un po' troppo grandi"), the mosaic column uses a fixed `lg:w-[40%]` instead of growing to fill the full remaining ~54% of the row — roughly a 25% size reduction on large desktop screens, per explicit user instruction. This leaves some empty space to the row's right on very wide screens rather than the mosaic stretching edge-to-edge; accepted as the simplest way to satisfy the exact "shrink ~25%" request without introducing a new sizing mechanism.
- Section heading is **left-aligned**, matching the mockup exactly — a deliberate difference from Skills'/Projects'/Education's centered heading, same left-aligned treatment Experience already uses for its own reasons (mockup fidelity over cross-section consistency, per the precedent set in units 06/07's Architecture notes).
- Heading translation: "About Me" (en) / "Chi sono" (it) — reuses the exact IT string already in `messages/it.json`'s `nav.about` key, not a new translation guess.
- Photo mosaic proportions, measured directly from the mockup (per the mockup-fidelity rule — transcribe real proportions, not framework defaults), at the placeholder-box level:
  - Large top box: measured ~598×422px in the mockup → aspect ratio ≈ 1.42:1. No standard Tailwind aspect utility matches exactly; use the arbitrary value `aspect-[598/422]` to preserve the measured ratio exactly, not a rounded `aspect-[3/2]`.
  - Two small bottom boxes (side by side, small gap between): measured ~297×229px and ~285×229px → both ≈ 1.3:1, close enough to treat as one shared ratio for a 2-column grid. Use `aspect-[4/3]` (1.33:1) as the closest clean ratio — flagged as a minor approximation, revisit once real photos (with their own native ratios) replace the placeholders, since real photos will drive their own box shape the same way Hero's did (see unit 04's `object-fit`/`aspect-[]` note in `ui_context.md`).
  - Gap between the two small boxes and between the large/small row: `clamp()`-based, per `ui_context.md`'s general spacing rule — not a fixed px value.
- Placeholder box colors: no color specified by the mockup (it shows real photos) or by the user. Assistant judgment call — cycle 3 of the site's existing decorative accent tokens (`--color-accent-yellow` for the large box, `--color-accent-red` and `--color-accent-green` for the two small boxes, in that order), reusing existing tokens only, no new ones added. Reversible/cheap to change — flag if a different color choice or arrangement was intended once real photos replace these.
- This section is **static, non-interactive** — same rule Skills' Architecture section already states (no click/expand, no hover/focus states since nothing here is a link, button, or otherwise interactive).
- All spacing in this section (gap between text/visual columns, gap between heading and paragraphs, gap between paragraphs, gap between the large and small photo boxes) uses `clamp()`-based arbitrary values, not discrete breakpoint tiers — same rule already applied throughout Skills and the rest of the site (`ui_context.md`'s "Layout — container globale", marked as applying to all sections). The only discrete tier is the structural `flex-col` ↔ `lg:flex-row` layout switch itself.

---

## Design

Based on `ui_context.md` (two-column pattern, typography table, accent tokens) plus `public/images/about-portfolio.png` (heading position, paragraph count, mosaic shape — see confirmed decisions above).

- Section wrapped in `<section id="about">`, same fluid outer container (`max-w-[1800px]`, fluid padding, same vertical `py-[clamp(...)]` rhythm) as Skills/other sections.
- Two-column row (`flex-col lg:flex-row`, text above visual when stacked below `lg`), `clamp()` gap between columns (e.g. `gap-[clamp(2rem,5vw,4rem)]`, matching Skills' inter-column gap).
  - **Left column — text** (`lg:w-[46%]`, matching Hero's text-column share): left-aligned heading "About Me"/"Chi sono" (`--color-heading`, bold, same heading type scale as other sections' `h2`), a `clamp()` gap below it, then two body paragraphs (`--color-body`, regular weight, same body type scale as Hero's `body` text) stacked with their own smaller `clamp()` gap between them.
  - **Right column — photo mosaic** (`lg:flex-1`): a large top box spanning the full column width at `aspect-[598/422]`, a `clamp()` gap below it, then a 2-column grid (`grid grid-cols-2`) of the two smaller boxes at `aspect-[4/3]` each with a `clamp()` gap between them. All 3 boxes are flat accent-colored `div`s (see Architecture's color decision) with the same rounded corners used elsewhere for photo-shaped boxes (explicit `rounded-[Npx]`, not the pill `rounded-*` scale — same reasoning as Hero's collage boxes in `ui_context.md`'s Session Notes, since these are photo-shaped, not pills).

---

## Implementation

1. Add an `about` namespace to `messages/en.json` and `messages/it.json`: `heading` ("About Me"/"Chi sono" — reuse `nav.about`'s IT string), `paragraphOne`, `paragraphTwo` (temporary placeholder copy, EN+IT — mark clearly as placeholder, to be replaced once real personal copy is provided; log as an open question, don't invent final copy).

2. Create `components/about-section.tsx` (Server Component, `async`, `getTranslations("about")`, no client component — static/non-interactive per Architecture):
   - Renders the two-column row described in Design.
   - Left: left-aligned heading + two paragraphs from the `about` namespace.
   - Right: the 3-box placeholder mosaic (large top box + 2-column grid of small boxes below), flat accent-colored `div`s per the Architecture color decision, no `next/image` yet (no real photo assets exist).

3. Wire `<AboutSection />` into `app/[locale]/page.tsx`, after `<SkillsSection />`.

---

## Scope Limits

- No real personal/non-work copy — placeholder text only, open question logged, no unit currently owns replacing it.
- No real photos — 3 flat-color placeholder boxes only, open question logged, no unit currently owns replacing them. No `next/image` usage in this unit (nothing real to load yet).
- No Contacts section — separate pass of this same unit/file, not built yet (unchanged from the Skills section's own Scope Limits).
- No click-to-expand, hover states beyond the site's link/button default, or any other interactivity — this section is static, same as Skills.
- No new color tokens — the 3 placeholder boxes reuse existing `--color-accent-*` tokens.
- Keep this focused on: the About section component, its i18n copy, and its wiring into the homepage.

---

## Check When Done

- `messages/en.json`/`it.json` both have an `about` namespace with `heading`, `paragraphOne`, `paragraphTwo`.
- `components/about-section.tsx` exists, renders without errors in both `/en` and `/it`.
- Heading renders bold and **left-aligned** (not centered), reading "About Me" (en) / "Chi sono" (it).
- Desktop (`≥ lg`): two columns side by side — text (heading + 2 paragraphs) on the left at ~46% width, photo mosaic (1 large box on top, 2 smaller boxes side by side below) on the right.
- Mobile (`< lg`): columns stack vertically, text above the photo mosaic.
- All 3 mosaic boxes render as flat accent-colored placeholders (no broken image icons, no `next/image` calls) at the measured aspect ratios (`aspect-[598/422]` large, `aspect-[4/3]` small).
- Both locales show translated placeholder heading/paragraph text (not raw `about.*` keys).
- Wired into `app/[locale]/page.tsx` immediately after `<SkillsSection />`.
- `npm run build` passes.
