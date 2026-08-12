<!-- Read before starting: AGENT.md, context/architecture_context.md, context/ui_context.md, context/user_flows.md, context/progress_tracker.md -->

# 08 — Skills, Contacts

<!-- This unit originally bundled 3 homepage sections. Decomposed per user request (2026-08-07):
     Skills is specced/built below (see Completed in progress_tracker.md).
     About was split out into its own file, context/features/8a-about-section.md — specced/built.
     Contacts was split out into its own file, context/features/8b-contacts-section.md — specced there, not built yet. -->

Build the homepage Skills section: two side-by-side columns — a "Technologies" logo grid and an "Approach" pill list — reading from a new `content/data/skills.ts`, wired into `app/[locale]/page.tsx` after the Experience section.

---

## Architecture, rules and constraints

- Reference mockup: `public/images/skils-portfolio.png` — annotated "Option B" (two labeled columns side by side), confirmed as the chosen direction by the mockup's own annotation, not a proposal to re-decide.
- Data source (new): `content/data/skills.ts`, matching the pattern already documented in `architecture_context.md`'s Content Model table and already used by `experience.ts`/`education.ts`:

  ```ts
  type Technology = { id: string; label: string; iconSlug: string }; // iconSlug → simple-icons
  type Methodology = { label: { en: string; it: string } };

  export const technologies: Technology[] = [...];
  export const methodologies: Methodology[] = [...];
  ```

  Types are defined inline in `content/data/skills.ts` (not added to `types/`) — the Content Model note for Skills doesn't call for a separate shared type file the way `Project`/`Experience`/`Education` do, and there's no cross-file reuse need.

- `lib/content.ts` gets two new reads, `getTechnologies()` and `getMethodologies()`, same shape as `getExperience()`/`getEducation()` (no sorting needed — both arrays render in their literal declared order).
- Icons: **Simple Icons** (`simple-icons` npm package), per the decision already logged in `architecture_context.md` ("`lucide-react` no longer has brand logos since v1.0"). Not installed yet — add as a new dependency in this unit. **Check the installed version's actual API shape before writing icon-rendering code** (per `AGENT.md`'s doc-check rule — `simple-icons`' export shape, e.g. `siReact`/`icons.get()`, has changed across major versions and predates none of this project's other post-cutoff-package cautions, so don't assume a remembered shape).
- **Revised (2026-08-07, after initial implementation): colored icons requested, `simple-icons` kept — not swapped for Devicon.** User asked for colored (not monochrome) Technologies icons and referenced a suggestion from another LLM to use "Devicons" instead. Checked online (August 2026) before deciding: the core `devicon` npm package is actively maintained (last publish July 2025) and covers all 14 needed technologies including Supabase and Vercel, but every React wrapper around it (`react-devicons`, `devicons-react`, `@devicon/react`) is stale — last publishes March 2024, August 2022, and December 2024 respectively. Switching would mean either depending on one of those unmaintained wrappers or hand-managing static SVG assets, for no actual gain: `simple-icons` (already installed, already verified working) returns a `.hex` field per icon with the brand's official color — colored icons only require rendering with that hex as the fill instead of `--color-heading`, no library change needed. Confirmed with user before implementing.
- **Decisions confirmed with user (2026-08-07), resolving mockup ambiguities before implementation:**
  1. **No dark card container.** The mockup's overall dark background and the small dark squares behind each Technologies icon are both artifacts of the mockup tool's dark canvas / an invisible alignment grid — not real UI elements. The Skills section sits directly on the normal light page background, same as every other homepage section. This also means no new "dark section" tokens are needed anywhere in this unit.
  2. **Technologies icons render bare** — no box, no background, no border per icon. Just the Simple Icons glyph, laid out in a grid for alignment.
  3. ~~Only the "Approach" items are real badges/pills, dark background + white text.~~ **Superseded (2026-08-07, same session):** per explicit user request, Approach pills no longer use the dark `--color-heading` background. Instead each pill cycles through the site's four existing decorative accent tokens — `--color-accent-blue`, `--color-accent-yellow`, `--color-accent-red`, `--color-accent-green`, in that literal order (user-specified, note this is blue→yellow→**red**→green, not the blue→yellow→green→red order Experience's marker dots use) — by declared array position, wrapping if more than 4 items existed. Text stays `--color-on-accent` (white), the same pairing already used everywhere else an accent color is a background (Projects' year badge, Education's panel). Still no new color tokens — reuses the four accent tokens that already exist, just applied here instead of `--color-heading`.
  4. **Further revision (2026-08-07, same session): the Agile pill's yellow is a one-off shade, not the shared token.** Applied only to the 2nd (Agile/SDLC) pill via an arbitrary Tailwind value — deliberately **not** a change to `--color-accent-yellow` itself, since that token is shared with Education's dot cycle and would visually affect unrelated components. Scoped to this one pill instance only. Iterated three times before landing on the final value: (1) `oklch(0.7 0.1431 68.82)` — user's own first color, judged too dark once rendered; (2) `oklch(0.8333 0.1246 91.06)` — user's second color, also rejected as "non va bene"; (3) **final**: back to the original token's exact hue/chroma (`0.1595 96`, unchanged from `--color-accent-yellow`) with lightness reduced 5% relative (`0.9111 × 0.95 ≈ 0.8655`), per explicit user instruction — `oklch(0.8655 0.1595 96)` as `bg-[oklch(0.8655_0.1595_96)]`.
  5. **Further revision (2026-08-07, same session): "Specification-Driven Development" is not translated to Italian.** Per user request, `methodologies[0].label.it` is now the identical English string, not "Sviluppo basato su specifiche" — kept as a fixed term in both locales, same treatment `Agile / SDLC` and `OOP` already got.
  6. **Technology count: all 14, not capped at the mockup's 8.** The mockup's 4×2 grid shows the _pattern_ (bare logos, 4-column grid), not an exact count — confirmed with user. Real list (in display order, row-major, 4 columns): TypeScript, JavaScript, Python, Next.js, React, Node.js, PostgreSQL, MySQL, MongoDB, Supabase, Figma, Git, Docker, Vercel. Grid grows to more rows (4 cols × 4 rows, last row 2 items) rather than truncating.
  7. **Approach items: 4 pills**, exact copy and order from the mockup (already matches `architecture_context.md`'s previously-logged methodology list verbatim, so this isn't a new decision, just a confirmation): Specification-Driven Development, Agile / SDLC, AI-assisted Engineering, OOP.
- **Not specified anywhere (mockup is desktop-only, no mobile variant shown) — assistant judgment calls, flag if a different intent was meant:**
  - Mobile stacking: below `lg`, the two columns stack vertically (Technologies above Approach, matching the mockup's left-to-right reading order rotated to top-to-bottom), each full width. Breakpoint `lg` (1024px) chosen for consistency with unit 07's reasoning (two side-by-side content columns need real horizontal room; `lg` was the safer floor there after the unit 04 tablet-squeeze lesson).
  - Technologies grid columns below `lg`: 3 columns (mockup's 4 only applies once there's room; 3 keeps icons a reasonable size on narrow viewports without the grid feeling sparse). 4 columns at `lg` and up, matching the mockup exactly. This column-count switch is a **structural** layout change (like the two-column-row ↔ stacked switch), not a continuous value — it's the one discrete tier this unit keeps, per the same carve-out `ui_context.md` already makes for the stacked-vs-side-by-side layout switch itself.
  - ~~Icon color: `--color-heading` (black)~~ **Superseded (2026-08-07):** icons render in their official brand color via each `simple-icons` icon's own `.hex` field (inline `style={{ fill: '#'+icon.hex }}`, not a Tailwind class — arbitrary per-icon hex values aren't expressible as a `fill-*` utility). See the colored-icons note in Architecture above.
- **Spacing/gaps — checked against `ui_context.md`'s "Layout — container globale" rule (2026-08-07, per explicit user request to re-verify, not assumed).** That rule sits under a heading marked "vale per tutte le sezioni" and its "Tipografia e spaziature verticali/orizzontali: `clamp()`, non tier a breakpoint discreti" line is general, not scoped to Hero/Nav — confirmed it applies here. Every continuous spacing value in this section (gap between icons, gap between pills, pill internal padding, gap between the two columns, gap between micro-label and its grid/list) must be a `clamp()`-based arbitrary value (e.g. `gap-[clamp(1rem,2vw,1.5rem)]`), not a discrete-breakpoint jump (e.g. `gap-4 lg:gap-6`). The only discrete tier kept in this unit is the structural one already named above (grid-cols 3→4, and the `flex-col`↔`flex-row` column-row switch) — both are layout-shape changes, not interpolable spacing/font values, matching the exact exception `ui_context.md` itself carves out ("l'unico switch discreto rimasto necessario è il cambio di layout stesso").
- This section is **static, non-interactive** — no click/expand behavior anywhere (unlike Education's selector or Experience's expand-on-click). Per `ui_context.md`'s "every interactive element needs hover/focus feedback" rule: since nothing here is a link, button, or otherwise interactive, no hover/focus states apply — this is a deliberate exclusion, not an oversight.

---

## Design

Based on `ui_context.md` plus `public/images/skils-portfolio.png` (per the confirmed decisions above — no dark card, colored bare icons, accent-colored Approach pills).

- Section wrapped in `<section id="skills">`, same fluid outer container (`max-w-[1800px]`, fluid padding) as the rest of the page.
- Heading: "Skills", bold, **centered**, no subheading — matches the mockup's literal content (only "Skills" appears above the two columns, no secondary line).
- Two-column row at `lg` and up (`lg:flex-row`, stacked `flex-col` below `lg` per the Architecture note), columns separated by a `clamp()` gap (e.g. `gap-[clamp(2rem,5vw,4rem)]`), not a discrete breakpoint jump:
  - **Left column — Technologies:** small grey micro-label "Technologies" (`--color-body`, small text, regular weight, not the section's bold/heading style), a `clamp()` gap below it to the grid (e.g. `mt-[clamp(0.75rem,2vw,1.25rem)]`), then `grid grid-cols-3 lg:grid-cols-4` (structural column-count switch, see Architecture) with a `clamp()` gap between icons (e.g. `gap-[clamp(1rem,3vw,1.75rem)]`) — bare Simple Icons glyphs, one per technology, each rendered in **its own official brand color** (`icon.hex`, inline style — see Architecture), no per-icon box/border/background (decision 2 above).
  - **Right column — Approach:** small grey micro-label "Approach", same `clamp()` gap below it as Technologies' label-to-content gap, then a vertical stack (`flex flex-col`) of 4 pills with a `clamp()` gap between them (e.g. `gap-[clamp(0.5rem,1.5vw,0.875rem)]`) — pill radius (global `--radius: 9999px`), background **cycling `bg-accent-blue` → _(2nd pill's one-off yellow, see Architecture decision 6)_ → `bg-accent-red` → `bg-accent-green` by position** (see Architecture decision 3), `text-on-accent` bold text, `clamp()`-based internal padding (e.g. `px-[clamp(1rem,2vw,1.5rem)] py-[clamp(0.625rem,1.5vw,0.875rem)]`) — not a fixed or breakpoint-tiered `px-4 py-2` — left-aligned text inside each pill, full width of the column.
- Accent colors (blue/yellow/red/green) now used for the Approach pills, per the revised decision above — this section is no longer an exception to the rest of the site's decorative-accent usage.

---

## Implementation

1. Install the `simple-icons` package (new dependency, see below). Check its current README/type exports for the correct per-icon access pattern before writing step 5.

2. Create `content/data/skills.ts`:
   - `Technology` and `Methodology` types (inline, see Architecture).
   - `technologies`: the 14 entries listed in Architecture decision 4, each with a stable `id` (kebab-case, e.g. `"nextjs"`), a display `label` (e.g. `"Next.js"`), and an `iconSlug` matching the installed `simple-icons` package's slug for that brand (e.g. `"nextdotjs"`, `"nodedotjs"` — verify exact slugs against the installed package, don't guess from memory).
   - `methodologies`: the 4 entries from Architecture decision 5, each with `label: { en, it }`. Only "AI-assisted Engineering" → "Ingegneria assistita da IA" is actually translated — the other three ("Specification-Driven Development", "Agile / SDLC", "OOP") are identical strings in both locales, per decision 7 (Specification-Driven Development) and the mockup's own literal acronyms (Agile / SDLC, OOP).

3. Add `getTechnologies()` and `getMethodologies()` to `lib/content.ts`, returning the arrays as-is (no sorting/filtering).

4. Add `skills` keys to `messages/en.json` and `messages/it.json`: `heading` ("Skills"), `technologiesLabel` ("Technologies"/"Tecnologie"), `approachLabel` ("Approach"/"Approccio"). No `subheading` key (per the confirmed no-subheading decision).

5. Create `components/skills-section.tsx` (Server Component, `async`, `getTranslations("skills")` + locale):
   - Reads `getTechnologies()` and `getMethodologies()`.
   - Renders the centered "Skills" heading (no subheading).
   - Renders the two-column row described in Design: Technologies grid (each icon rendered from its `iconSlug` via the installed `simple-icons` package's API, filled with that icon's own `.hex` color via inline `style`, `title`/`aria-label` set to the technology's `label` for accessibility since the icon alone isn't sufficiently labeled for screen readers), Approach pill list (`methodologies[].label[locale]`, background cycling the four accent classes by array index — see Architecture decision 3).
   - No client component needed — nothing here is interactive.

6. Wire `<SkillsSection />` into `app/[locale]/page.tsx`, after `<ExperienceSection />`.

---

## Dependencies

Install: `simple-icons`

---

## Scope Limits

- **No About section** — split into its own file, `8a-about-section.md`, not built yet.
- **No Contacts section** — split into its own file, `8b-contacts-section.md`, not built yet.
- No dark card/container anywhere in this section (explicitly ruled out — see Architecture decision 1).
- No per-icon box/background/border on the Technologies grid (decision 2).
- No new color tokens — Technologies icons use their own `simple-icons` `.hex` value, Approach pills reuse the four existing `--color-accent-*` tokens + `--color-on-accent` (decision 3, revised).
- No click-to-expand, hover states beyond the site's link/button default, or any other interactivity — this section is static.
- No switch to Devicon or any Devicon React wrapper — evaluated and rejected, see Architecture (colored icons achieved via `simple-icons`' existing `.hex` field instead).
- Keep this focused on: the Skills section component, its content-layer data, and its wiring into the homepage.

---

## Check When Done

- `content/data/skills.ts` exports `technologies` (14 entries) and `methodologies` (4 entries), matching Architecture decisions 4 and 5 exactly.
- `lib/content.ts` exports `getTechnologies()` and `getMethodologies()`.
- `components/skills-section.tsx` exists, renders without errors in both `/en` and `/it`.
- Section heading "Skills" renders bold and centered, no subheading, on a normal light background (no dark card anywhere).
- Desktop (`≥ lg`): two columns side by side — Technologies (micro-label + 4-column grid of 14 bare, brand-colored Simple Icons logos, no per-icon box) on the left, Approach (micro-label + vertical stack of 4 pills cycling blue / one-off darker-yellow / red / green backgrounds with bold white text) on the right.
- Mobile (`< lg`): columns stack vertically, Technologies above Approach, grid drops to 3 columns.
- All 14 technology icons render the correct brand logo **in that brand's own color** (spot-check a few against simple-icons' own reference, e.g. Next.js, Node.js, PostgreSQL — slugs that are easy to get subtly wrong; also confirm the fill is visibly colored, not solid black; note Next.js and Vercel's own brand color is legitimately black).
- Approach pills render in blue, (one-off yellow `oklch(0.8655 0.1595 96)`), red, green order (1st through 4th pill) — not the blue/yellow/green/red order Experience uses, and not the plain `--color-accent-yellow` token.
- Both locales show translated `technologiesLabel`/`approachLabel` micro-labels; Approach pill text is translated only for "AI-assisted Engineering" → "Ingegneria assistita da IA" — the other three pills (Specification-Driven Development, Agile / SDLC, OOP) are identical strings in both locales.
- `npm run build` passes.

---
