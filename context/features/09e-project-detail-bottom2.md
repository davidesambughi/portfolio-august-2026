## This file has to be written precisely, clearly , and concisely. Do not add , assume or invent, but ask for more information if you need it .

# 09e — Project Detail Page: Bottom2 (Stripe Sub-Section, Legend Box, GitHub/Email CTA)

<!-- Read before starting: AGENTS.md, context/architecture_context.md, context/ui_context.md, context/features/09-project-detail-page.md, context/features/09b-project-detail-top1.md, context/features/09c-project-detail-top2.md, context/features/09d-project-detail-bottom1.md -->

Build the fourth visual slice of the Project Detail Page's real design (Pass B, position-based microfase, continuing after top1/top2/bottom1) — a second H2 section ("Stripe – Case Study": short text + colored legend box + diagram image), and a redesigned end-of-page CTA (GitHub repo link + email, replacing Pass A's plain text footer links), against `public/images/bottom2.png`.

---

## Architecture, rules and constraints

- Builds on unit 09 Pass A (routing/MDX mechanics) and 09b/09c/09d (`Callout`, `DashboardGallery`, `FlowDiagram`, `SectionImage`, the page's ancestor `.prose` wrapper). No changes to Pass A's routing/data mechanics.
- **Heading hierarchy (confirmed with user)**: `## Stripe – Case Study` — a second **H2**, a sibling section to "Il Processo" (bottom1), not nested under it. Same mockup ambiguity as bottom1 ("HEADING H2 O H3", undecided in the mockup itself) — user confirmed H2 again, consistent with the pattern of independent, position-based sections. Left-aligned via the same explicit-`text-left`-on-the-heading technique as bottom1.
- **Heading position — different from bottom1, confirmed with user after re-measuring the mockup pixel-by-pixel**: in bottom1, the H2 was the first child *inside* the text column, at the same height as the side image. Re-checking `bottom2.png`'s actual pixel positions: the image box's top edge sits well below the heading's bottom edge, aligned instead with the paragraph's top — meaning the H2 here is **full-width, above the two-column row** (a sibling of the row, not nested inside the text column). The two-column row's first child becomes the paragraph (not the heading).
- **Content model**: same as bottom1 — authored directly in the case study's `.mdx` body, appended after bottom1's `<FlowDiagram>` (the process-diagram one). No new `ProjectMeta` frontmatter fields except populating the existing (already-defined, previously empty) `githubUrl` — see the CTA point below.
- **Left-column text is placeholder, not real content (confirmed with user)** — unlike bottom1's paragraphs (real, user-written), the mockup's own text ("TESTO NON SO BENE COSA PERO...", literally "I don't know exactly what text") states the content itself is undecided. User confirmed the **structure**: a short prose paragraph (not a bullet list), "ultra concise" per the mockup's own annotation. The actual sentence is assistant-authored placeholder copy for now — logged as a non-blocking open question, same treatment as Callout's item copy in top1.
- **New component, `components/mdx/legend-box.tsx`**: `LegendBox` — props `children: ReactNode`. Renders a small colored box (confirmed with user: a real styled box, not a plain caption like the rest of the page's images) sitting in the **left column**, below the paragraph — not under the image on the right (measured from the mockup: the green box's x-position aligns with the text column, not the image column). Background color: `bg-accent-green/10` (tinted, not solid), matching `Callout`'s existing tint pattern (`bg-accent-blue/10`) for the same reason (the mockup shows a pale/pastel fill, not a fully-saturated block) — **this specific opacity value is a judgment call, not user-specified** (the user confirmed a "real colored box" but not the exact shade), logged as a non-blocking open question. `rounded-[16px]` (smaller than `Callout`/`FlowDiagram`'s `rounded-[24px]`, since this is a much smaller element — a proportional judgment call, also flagged). Content is the diagram's caption/legend text, itself placeholder (same non-blocking status as the paragraph above).
- **`SectionImage` (from 09d) is reused for the right-side diagram image, with two retrofitted changes** (both needed for a correct reuse — documented here as they affect 09d's existing component, not just this unit's new content):
  - `caption` becomes **optional** — this instance has no caption underneath the image (the legend already lives in the left column via `LegendBox`), where every prior use (bottom1's `context-folder.png`) always passed one. When omitted, the caption `<p>` doesn't render.
  - The column width, previously hardcoded inside the component as `lg:w-[38%]` (bottom1's own post-launch size-reduction fix), becomes a new required prop, `widthClassName: string`, passed per instance. This is necessary because this unit's mockup shows the image taking up **most** of the row (measured ≈ 68% of the row's width, text ≈ 29%) — the opposite proportion from bottom1, where the image had to be *narrowed*. Reusing bottom1's fixed `38%` unchanged would visibly contradict this mockup. `content/projects/{en,it}/remote-nif.mdx`'s existing bottom1 `<SectionImage>` call is updated to pass `widthClassName="lg:w-[38%]"` explicitly, preserving its current rendered size exactly — no visual change to bottom1.
  - This unit's own `<SectionImage>` call passes `widthClassName="lg:flex-1"` (fills the remaining row space after the narrower text column below), matching `ui_context.md`'s documented sitewide default for a two-column text+visual row — bottom1 was the deliberate exception (user-requested shrink), not the new default.
- **Text column width for this row (mockup-measured, narrower than the sitewide 46% default)**: `lg:w-[32%]` — measured from `bottom2.png` (text column ≈ 29% of the row, image ≈ 68%), rounded to a clean value. Flagged as an explicit deviation from `ui_context.md`'s general `lg:w-[46%]` default, justified by this specific mockup's own proportions (per the "be precise with the visual mockup, same shape/proportion" instruction) — not a new sitewide rule.
- **Diagram image aspect ratio**: `aspect-[19/10]` — measured approximately from the mockup's "IMMAGINE STRIPE FLOW" box (≈1.9:1), same ratio already used for top1's hero image (coincidentally close, not forced to match).
- **End-of-page CTA — replaces Pass A's existing footer links entirely (confirmed with user)**: Pass A's `page.tsx` footer block (`<Link href="/">{t("backToHome")}</Link>` + conditional `<a>` "View on GitHub") is removed. Per explicit user decision, **`Back to homepage` is dropped entirely** (redundant with the always-present sticky nav), not just restyled. In its place: a new `components/project-cta.tsx` (**not** an MDX component — this is driven by shared frontmatter/contact data, not per-instance `.mdx` body content, so it lives outside `components/mdx/` and is rendered directly in `page.tsx`'s own JSX, same category as `page.tsx`'s header) — `ProjectCta`, an async Server Component:
  - Reads `getContactLinks()` (from `lib/content.ts`, unit 8b — no new data source) for the Gmail entry (confirmed with user: reuses the same email already used in Contacts, `davidesambughi@gmail.com`, no duplicated data).
  - Takes `githubUrl?: string` as a prop (from `project.githubUrl`) — renders the GitHub link only when present, same conditional behavior Pass A already had (not a regression — a future project without a `githubUrl` still gets a working CTA box with just the email + tagline).
  - Icons: reuses the same `simple-icons` `siGithub`/`siGmail` `.path` values already imported in `components/footer.tsx` (no new icon dependency) — plain grey glyphs, same treatment as the Contacts footer's icons (not brand-colored).
  - Tagline text: the mockup's own example phrase ("Hit me up for any questions or suggestions") is explicitly not-yet-decided per the user ("frase tipo" = "a phrase like this") — an assistant-authored placeholder is used for now (`messages/{en,it}.json`'s new `projectDetail.ctaTagline` key), logged as a non-blocking open question, same treatment as the paragraph/legend text above.
- **Revised (2026-08-09, same session), per explicit user request, immediately after the above was built and reviewed**: the `ProjectCta` box (tagline + GitHub/Gmail icons) described above is **removed entirely** — `components/project-cta.tsx` deleted, `projectDetail.ctaTagline` removed from `messages/{en,it}.json`. Replaced with two separate, simpler changes: (1) the GitHub repo link moves next to the `h1` project title itself (inline `siGithub` SVG, same `projectDetail.viewOnGithub` translation key reused as its `aria-label`, rendered only when `project.githubUrl` is set — same conditional behavior as before, just relocated); (2) the site's existing `Nav` and `Footer` components (the same ones used on the homepage) are now rendered on the Project Detail Page too — `Nav` above the page header, `Footer` as the page's closing element — instead of any page-specific footer/CTA element. `app/[locale]/project/[slug]/page.tsx` restructured to the same `flex min-h-dvh flex-col` → `<main><Nav/>...</main><Footer/>` shape as `app/[locale]/page.tsx`. This also **fixed the now-resolved `githubUrl` gap** below without a dedicated CTA box being needed for it.
  - **Follow-up bug fix, same session**: `Nav`'s section links (`href="#projects"` etc.) were same-page anchors only — dead links from the Project Detail Page, which has none of those section ids. Fixed by switching every `Nav` link to next-intl's `Link` with `href="/#${anchor}"` (locale-aware, works cross-page by navigating home first then scrolling). Also added a missing **"Home"** nav item (`{ key: "home", anchor: "hero" }`, merged into the existing scroll-spy `NAV_ITEMS` array — `components/hero.tsx` gained `id="hero"`), `messages/{en,it}.json` gained `nav.home`. Two more scroll-spy follow-ups, both per user request: "Home" bolds automatically while Hero is in view (same mechanism, no extra code); "Contacts" now reliably bolds at the very bottom of the page — previously blocked by the tall About section still spanning the observer's `-40%/-55%` band even at max scroll, fixed by checking `isAtBottom()` first inside the `IntersectionObserver`'s own callback (not just a separate `scroll` listener, which the observer kept overriding). See `progress_tracker.md`'s 09e entry for the full account — this is a site-wide `components/nav.tsx` change, not scoped to this unit's original content.
- **`githubUrl` now has a real value for `remote-nif`** (confirmed with user): `https://github.com/davidesambughi/remoteNif-Context-Driven-Development` — added to both locale `.mdx` files' frontmatter, replacing the previously-unset placeholder gap logged in 09b's Open Questions (now resolved).
- **Box dimensions annotated in the mockup ("1196 × 100")**: a design-tool artboard reference, not a literal fixed pixel size to reproduce — consistent with the sitewide fluid (`clamp()`-based) sizing rule; the CTA box's actual size follows normal responsive/fluid rules like every other element on the page, not a hardcoded `100px` height.
- **Left-margin "TOC/document tabs" annotation**: same recurring annotation as top1/bottom1 — still deferred, no sidebar element built here (no need to re-confirm, already an established decision).
- **"LINK" label in the mockup, above the CTA box (confirmed with user)**: not a real heading — purely an annotation in the mockup, not rendered as UI. No `## Link` heading is added.

---

## Design

Per `public/images/bottom2.png`. Mid-fi mockup — proportions are a direction, not pixel-exact; adjust visually once rendered.

1. **Heading** (`## Stripe – Case Study`, full-width, above the two-column row — see the Architecture position note): explicit `text-left` on the H2, `mt-[clamp(2.5rem,5vw,4rem)]` above it (same vertical rhythm as every prior major block).

2. **Outer row** (shared flex container, authored in the `.mdx` body, immediately below the heading): `flex flex-col lg:flex-row lg:items-start gap-[clamp(1.5rem,3vw,2.5rem)] mt-[clamp(1rem,2vw,1.5rem)]` (a smaller top margin than the heading's own — it's a sub-element of this section, not a new major block). Below `lg`: stacks (text+legend column first, image below). At `lg`+: side by side.

3. **Text + legend column** (`w-full lg:w-[32%]`, first flex child, no column-level alignment override — the paragraph inherits the page's centered default):
   - One short placeholder paragraph (centered), plain `prose` styling.
   - `LegendBox` below the paragraph (`mt-[clamp(1rem,2vw,1.5rem)]`), containing placeholder legend/caption text for the diagram — `bg-accent-green/10`, `rounded-[16px]`, padding `p-[clamp(0.75rem,1.5vw,1.25rem)]`, `text-sm text-body` (or `text-heading` for a short bold label prefix, mirroring the mockup's "TESTO DIDASCALIA..." framing — a small judgment call on internal structure, flagged non-blocking).

4. **Diagram image** (`SectionImage`, second flex child, `widthClassName="lg:flex-1"`, `aspectClassName="aspect-[19/10]"`, no `caption` prop): single image, `bg-muted` fallback, `rounded-[20px]`, `next/image` `fill object-contain` — same visual treatment as every other placeholder image on the page, just without a caption underneath (the legend already covers that role, in the left column).

5. **End-of-page CTA** (`ProjectCta`, rendered in `page.tsx` after the MDX content, replacing Pass A's old footer links entirely): a single bordered, rounded box (`border border-border rounded-[24px]`, padding `p-[clamp(1.5rem,3vw,2rem)]`) spanning the page's standard container width, `flex flex-col sm:flex-row items-center justify-between gap-[clamp(1rem,2vw,1.5rem)]` — placeholder tagline text on one side, GitHub + email icon-links (grey glyphs, same hover/focus color-darken feedback as the Contacts footer) on the other. No "Back to homepage" link anywhere on the page outside the sticky nav.

6. No responsive breakpoint tuning beyond the single structural switch already named (two-column at `lg`, stacked below it; the CTA box itself switches `flex-col` → `sm:flex-row` for its own internal layout, since it's a much shorter/wider element that doesn't need to wait for `lg`).

---

## Implementation

1. `components/mdx/section-image.tsx`: make `caption` optional (`caption?: string`, only render the `<p>` when present); replace the hardcoded `lg:w-[38%]` with a new required prop `widthClassName: string`, applied in place of the old fixed class.

2. `content/projects/en/remote-nif.mdx` and `content/projects/it/remote-nif.mdx`: update the existing bottom1 `<SectionImage>` call to add `widthClassName="lg:w-[38%]"` (no other change — preserves bottom1's current rendered size).

3. Create `components/mdx/legend-box.tsx`:
   - Export `LegendBox` (props `children: ReactNode`) rendering the small colored box described in Design.

4. `app/[locale]/project/[slug]/page.tsx`:
   - Add `LegendBox` to the MDX `components` map (alongside `Callout`, `CalloutItem`, `DashboardGallery`, `FlowDiagram`, `SectionImage`).
   - Remove the existing footer block (`<Link href="/">{t("backToHome")}</Link>` + conditional GitHub `<a>`).
   - Import and render `<ProjectCta githubUrl={project.githubUrl} />` in its place, after the MDX content `div`.

5. Create `components/project-cta.tsx`:
   - Export `ProjectCta` (async Server Component, props `githubUrl?: string`) rendering the CTA box described in Design — `getContactLinks()` for the Gmail entry, `getTranslations("projectDetail")` for the tagline and the GitHub link's accessible label, `siGithub`/`siGmail` icons (same import source as `components/footer.tsx`).

6. `content/projects/en/remote-nif.mdx` and `content/projects/it/remote-nif.mdx`: append, after the existing bottom1 content, before the frontmatter change below:
   - `<h2 className="text-left">Stripe – Case Study</h2>` (full width, own line — not nested inside the row below).
   - A `<div className="flex flex-col lg:flex-row lg:items-start gap-[clamp(1.5rem,3vw,2.5rem)] mt-[clamp(1rem,2vw,1.5rem)]">` wrapping:
     - A `<div className="w-full lg:w-[32%]">` containing one placeholder paragraph and a `<LegendBox>` with placeholder legend text (per locale).
     - `<SectionImage src="/images/projects/remote-nif/stripe-flow.png" alt="..." aspectClassName="aspect-[19/10]" widthClassName="lg:flex-1" />` (no `caption` prop), real descriptive `alt` per locale.
   - Update the frontmatter: `githubUrl: "https://github.com/davidesambughi/remoteNif-Context-Driven-Development"` (both locale files).

7. `messages/en.json`/`it.json`: remove `projectDetail.backToHome`; keep `projectDetail.viewOnGithub` (reused as the CTA's GitHub link accessible label); add `projectDetail.ctaTagline` (placeholder text, per locale).

---

## Dependencies

None — `simple-icons` already installed (unit 08), same `siGithub`/`siGmail` exports already used in `components/footer.tsx`.

---

## Scope Limits

- Only the "Stripe – Case Study" section (text, legend box, diagram image) and the end-of-page chrome change (GitHub link relocated next to the `h1`, `Nav`/`Footer` reused from the homepage) — not the TOC sidebar (still deferred), not any further semantic sections beyond this one, not the "LINK" label (confirmed as a non-rendered mockup annotation).
- No real screenshot/diagram asset for `stripe-flow.png` — `bg-muted` fallback placeholder only, same as every prior placeholder image.
- No real copy for the left-column paragraph, the legend box text, or the CTA tagline — all placeholder, logged as open questions.
- No new `ProjectMeta` fields — only populating the already-existing `githubUrl` field with a real value.
- Don't touch `components/mdx/callout.tsx` or `components/mdx/dashboard-gallery.tsx`.
- Don't build any TOC sidebar element.
- Don't add a new icon dependency — reuse `simple-icons`' existing `siGithub`/`siGmail` exports.

---

## Check When Done

- `components/mdx/section-image.tsx`'s `SectionImage` has an optional `caption` and a required `widthClassName` prop; bottom1's existing usage (`context-folder.png`) still renders at the same size as before this unit (`lg:w-[38%]`, now passed explicitly).
- `components/mdx/legend-box.tsx` exports `LegendBox`, used only via the MDX `components` map.
- `components/project-cta.tsx` no longer exists (removed in the same-session revision) — the GitHub link lives inline next to the `h1` in `page.tsx`, `Footer` (from `components/footer.tsx`) is reused as the page's closing element instead.
- Visiting `/en/project/remote-nif` and `/it/project/remote-nif` renders, below bottom1's process-diagram image: a left-aligned "Stripe – Case Study" H2 spanning the full container width (not confined to the narrow text column), followed by a two-column row — a centered placeholder paragraph + green-tinted legend box on the left (narrower than bottom1's text column), a diagram placeholder image filling most of the row's remaining width on the right — stacked full-width below `lg`.
- `Nav` (homepage component) renders above the page header, including a working "Home" link and cross-page-aware section links; the project title (`h1`) shows an inline GitHub icon linking to the real `remoteNif-Context-Driven-Development` repo URL; `Footer` (homepage component, includes the real Gmail link) renders at the very end of the page — no standalone CTA box, no "Back to homepage" link.
- `npm run build` passes.

---

## Open Questions (non-blocking, must resolve before this unit is marked done)

- The left-column paragraph text and the legend box's text are assistant-authored placeholders — the user explicitly said this content isn't decided yet — confirm or replace when ready. (The CTA tagline question no longer applies — the CTA box was removed.)
- `LegendBox`'s exact shade (`bg-accent-green/10`) and corner radius (`rounded-[16px]`) are judgment calls, not measured/specified — revisit if it doesn't read as intended once rendered.
- `stripe-flow.png` doesn't exist yet — renders on `bg-muted` fallback, same non-blocking gap as every other placeholder image on this page. `aspect-[19/10]` is an approximate mockup read, not pixel-measured.
- `SectionImage`'s `widthClassName` retrofit changes 09d's component API — `09d-project-detail-bottom1.md` itself is not being edited retroactively (this file documents the change); flag if the historical record should be updated there too.
