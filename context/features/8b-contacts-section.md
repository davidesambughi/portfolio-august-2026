## This file has to be written precisely, clearly , and concisely. Do not add , assume or invent, but ask for more information if you need it .

# 8b — Contacts Section

<!-- Read before starting: AGENT.md, context/architecture_context.md, context/ui_context.md, context/user_flows.md, context/progress_tracker.md, context/features/08-skills-about-contacts.md (shared conventions this unit follows: fluid container, clamp() spacing, static/non-interactive Server Component pattern). -->

Build the site's closing footer — a single row with name/role on the left and a "Follow Me" row of 3 real external links (LinkedIn, GitHub, Gmail) on the right — wired into `app/[locale]/page.tsx` as the last element, after `<AboutSection />`.

---

## Architecture, rules and constraints

- Reference mockup: `public/images/contacts-footer-portoflio.png` — "Follow Me" label, a vertical divider bar, a row of icons, a horizontal rule, then a "Gmail" micro-label with the email address spelled out below it. A solid black bar runs the full width at the very top edge.
- **Confirmed with user (2026-08-07), resolving real gaps before implementation — do not guess these:**
  1. **Only 3 real links, not the mockup's 6 icons.** The mockup shows X, YouTube, LinkedIn, Instagram, Facebook, TikTok — none of these accounts exist except LinkedIn. Per explicit user override, the icon row is **LinkedIn, GitHub, Gmail** only (in that order), matching the decision already logged in `architecture_context.md`'s "Deciso" section ("GitHub/LinkedIn/Gmail in Contacts") over the mockup's literal icon set. This is a deliberate exception to the mockup-fidelity rule, confirmed by the user, not an assistant guess.
  2. **The top black bar is a real top border**, not a mockup-tool artifact (unlike Skills' dark background, which was confirmed as tool-canvas noise in unit 08). Render it as an actual border on the footer element.
  3. **No section heading.** Per user: "questo è un footer" — unlike Skills/About/Education, there is no "Contacts"/"Contatti" title. "Follow Me" is the only label, exactly as the mockup shows, with no heading above it.
  4. **Real destination URLs** (not placeholders, confirmed by user):
     - GitHub: `https://github.com/davidesambughi`
     - LinkedIn: `https://www.linkedin.com/in/davide-sambughi-358b903aa/`
     - Gmail: `mailto:davidesambughi@gmail.com`
  5. **LinkedIn is not available in the installed `simple-icons` package.** Checked online (2026-08-07) before deciding, since this contradicts `architecture_context.md`'s existing assumption that all 3 icons come from Simple Icons: LinkedIn was permanently removed from `simple-icons` in v14.0.0 for trademark reasons (confirmed via the project's own GitHub issue #11372) — the installed v16.28.0 has no `siLinkedin` export. GitHub (`siGithub`) and Gmail (`siGmail`) are both present and used as in unit 08. Per user decision, LinkedIn renders via **one hardcoded inline SVG path** in the component (the standard 24×24 "in" badge glyph) — no new icon package installed for a single missing icon, same reasoning already used in unit 08 to reject swapping to Devicon for a partial gap. `architecture_context.md`'s "Deciso" line about Simple Icons covering GitHub/LinkedIn/Gmail should be corrected to note LinkedIn's exception once this unit ships.
- **Revised (2026-08-07, after initial implementation): single row, not the mockup's 2-row layout.** Per explicit user request, the second row (small "Gmail" label + spelled-out email address) is removed entirely — the Gmail icon in Row 1 already covers that link. Row 1's content (the "Follow Me" label + divider + 3 icon links) is pushed to the right (`justify-between`), and the left side now shows the person's name and role — `Davide Sambughi` / `Full Stack Developer`, reusing the existing `hero.name`/`hero.role` translation keys rather than duplicating the strings under a new key. This supersedes the mockup's literal 2-row structure and the "no heading" framing above still holds (this is name/role identity text, not a section title).
- Icon color: **plain grey** (`text-body`, no per-icon box/brand color) — the mockup's icons read as flat grey/black glyphs, not colored brand marks, a deliberate difference from Skills' colored Simple Icons treatment.
- This section **is interactive** (3 real clickable links) — per `ui_context.md`'s "every interactive element needs hover/focus feedback" rule: `text-body` → `hover:text-heading`/`focus-visible:text-heading`, `transition-colors` 200ms, same standard as the rest of the site. This is a deliberate difference from Skills/About, which are static.
- All spacing (gap around the divider, gap between icons, gap between the two rows, padding) uses `clamp()`-based arbitrary values, not discrete breakpoint tiers — same rule already applied throughout the site (`ui_context.md`'s "Layout — container globale", "vale per tutte le sezioni"). No structural breakpoint switch is needed in this unit — a `flex-wrap` row handles narrow viewports without a layout-shape change, unlike sections with a stacked-vs-side-by-side switch.
- Contact link data follows the same pattern as Skills' `content/data/skills.ts` (per `architecture_context.md`'s Content Model table): a new `content/data/contacts.ts` file, inline type, one exported array, no sorting.

---

## Design

Based on `ui_context.md` (fluid container, typography table, interaction table) plus `public/images/contacts-footer-portoflio.png` (row structure, divider positions — see confirmed decisions above).

- Rendered as `<footer id="contacts">`, not `<section>` — this is the page's closing footer, not a titled content section (per the confirmed "no heading" decision). Same fluid outer container as the rest of the page (`max-w-[1800px]` centered, fluid `px-[clamp(...)]`), plus a full-width top border (`border-t border-heading`) running edge-to-edge above the container, per the confirmed real-border decision.
- **Single row** (`flex flex-wrap items-center justify-between`): left side is the name/role block (`Davide Sambughi` bold, line break, `Full Stack Developer` bold, both `--color-heading`, reusing `hero.name`/`hero.role`); right side is "Follow Me" label (`--color-body`, small text, same micro-label treatment as Skills' "Technologies"/"Approach" labels), a vertical divider (`h-4 w-px bg-border`), then the 3 icon links (LinkedIn, GitHub, Gmail — that order) as plain `<a>` tags, each a bare SVG glyph (`text-body`, `hover:text-heading`, `focus-visible:text-heading`, `transition-colors`), `aria-label` set to the platform name ("LinkedIn"/"GitHub"/"Gmail") since the icon alone isn't sufficiently labeled for screen readers. `target="_blank" rel="noopener noreferrer"` on GitHub/LinkedIn (external); the Gmail link is a plain `mailto:` href, no `target`.
- No horizontal rule, no second row — removed per the revision above.

---

## Implementation

1. Create `content/data/contacts.ts`:
   - Inline type: `type ContactLink = { id: string; label: string; href: string }` (icon component is chosen in the component itself by `id`, not stored as data — only 3 fixed icons, no dynamic icon-slug lookup needed like Skills' Simple Icons grid).
   - `contactLinks: ContactLink[]` — 3 entries in display order: `{ id: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/davide-sambughi-358b903aa/" }`, `{ id: "github", label: "GitHub", href: "https://github.com/davidesambughi" }`, `{ id: "gmail", label: "Gmail", href: "mailto:davidesambughi@gmail.com" }`.

2. Add `getContactLinks()` to `lib/content.ts`, same shape as `getTechnologies()`/`getMethodologies()` (returns the array as-is, no sorting).

3. Add a `contacts` namespace to `messages/en.json` and `messages/it.json`: `followMe` ("Follow Me"/"Seguimi") only — name/role text reuses the existing `hero.name`/`hero.role` keys, not a new copy.

4. Create `components/footer.tsx` (Server Component, `async`, `getTranslations("contacts")` + `getTranslations("hero")`):
   - Reads `getContactLinks()`.
   - Renders the `<footer id="contacts">` described in Design: top border, single row — name (`hero.name`) + line break + role (`hero.role`) on the left, "Follow Me" label + divider + 3 icon links on the right.
   - LinkedIn's icon: a hardcoded inline `<svg>` (24×24 viewBox, single `<path>`, the standard "in" badge glyph) defined directly in this file — no new package. GitHub/Gmail icons: `siGithub`/`siGmail` from the already-installed `simple-icons` package (`icon.path`, same `<svg viewBox="0 0 24 24"><path d={icon.path} /></svg>` pattern already used in `skills-section.tsx`), rendered in plain grey (`fill-current`/`text-body`, not the icon's own `.hex` brand color — see Architecture's plain-grey decision).

5. Wire `<Footer />` into `app/[locale]/page.tsx`, as a sibling immediately after `</main>` (not nested inside it — a `<footer>` landmark isn't part of `<main>`), after `<AboutSection />`, replacing the existing `{/* Contacts section — rest of unit 08 */}` comment.

---

## Scope Limits

- No CV download link — separate open item (`architecture_context.md`'s "Aperto" section, "Gestione file CV"), not decided yet, not part of this unit.
- No X/YouTube/Instagram/Facebook/TikTok links — mockup showed a generic 6-icon pattern, not the real intended account set; confirmed with user as only LinkedIn/GitHub/Gmail.
- No new icon package dependency — LinkedIn ships as one hardcoded inline SVG, not a `react-icons`/other library install.
- No colored/brand-hex icons — all 3 render in plain grey, unlike Skills' colored Technologies icons.
- Keep this focused on: the footer component, its content-layer data, its i18n copy, and its wiring into the homepage as the final element.

---

## Check When Done

- `content/data/contacts.ts` exports `contactLinks` with exactly 3 entries (LinkedIn, GitHub, Gmail, in that order) with the exact confirmed URLs.
- `lib/content.ts` exports `getContactLinks()`.
- `components/footer.tsx` exists, renders without errors in both `/en` and `/it`, as a `<footer id="contacts">` (not `<section>`).
- No heading text ("Contacts"/"Contatti") renders anywhere in this unit.
- A real top border renders across the full width above the footer content.
- Single row: name ("Davide Sambughi") + role ("Full Stack Developer") on the left, "Follow Me"/"Seguimi" + a vertical divider + exactly 3 grey icon links (LinkedIn, GitHub, Gmail) on the right — no other social icons, no second row, no horizontal rule.
- LinkedIn's icon renders the "in" badge glyph correctly (visually spot-check against the real LinkedIn logo — this path is hand-sourced, not pulled from an installed package).
- Clicking each icon navigates to the correct destination: LinkedIn/GitHub open the real profile URLs in a new tab, Gmail opens a `mailto:` compose to `davidesambughi@gmail.com`.
- All 3 icon links show the hover/focus color-darken feedback (`text-body` → `text-heading`) per the site's standard interaction rule.
- Both locales show translated `followMe` text (not a raw `contacts.followMe` key); name/role render from the existing `hero.name`/`hero.role` keys.
- Wired into `app/[locale]/page.tsx` as a sibling after `</main>`, after `<AboutSection />`.
- `npm run build` passes.
