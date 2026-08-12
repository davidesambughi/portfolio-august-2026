## This file has to be written precisely, clearly , and concisely. Do not add , assume or invent, but ask for more information if you need it .

# 09f — Project Detail Page: Architecture Section

<!-- Read before starting: AGENTS.md, context/architecture_context.md, context/ui_context.md, context/features/09-project-detail-page.md, context/features/09c-project-detail-top2.md, context/features/09d-project-detail-bottom1.md -->

Add a new H2 "Architecture" section to the RemoteNIF case study — a real architecture diagram on the left, real explanatory text on the right — inserted between top2's end-to-end flow diagram and bottom1's "Il Processo"/"The Process" section.

---

## Architecture, rules and constraints

- Builds on unit 09 Pass A (routing/MDX mechanics) and 09b/09c/09d/09e (`Callout`, `FlowDiagram`, `SectionImage`, `LegendBox`, the page's ancestor `.prose` wrapper). No changes to Pass A's routing/data mechanics.
- **No pixel mockup exists for this section** — unlike top1/top2/bottom1/bottom2, which were each built against a specific `.png` mockup. The user instead specified the layout verbally (image left / text right) and provided the real content directly: the diagram image (`public/images/architettura-inglese-remotenif.png`, 1540×1371px) and a text document (`context/portfolio-testo-architettura.md`, to be deleted after use). Layout follows the sitewide two-column text+image pattern already established in bottom1 ("Il Processo"), mirrored (image first/left, text second/right) — confirmed with the user as the standard-proportion option, not a new pattern.
- **Placement (confirmed with user)**: below the end-to-end flow diagram (the `<SectionImage src="/images/END-TO-END.png" .../>` block, part of top2/09c's content) and above the "Il Processo"/"The Process" H2 (bottom1/09d's content) — both in `content/projects/en/remote-nif.mdx` and `content/projects/it/remote-nif.mdx`.
- **Content source (confirmed with user)**: the "versione estesa" (extended version) from `context/portfolio-testo-architettura.md` — six paragraphs (intro sentence + Proxy / Server Components / Server Actions / Route Handlers / `lib/` layer / external services, plus a closing paragraph on the two special flows), each with a bold lead label except the intro and closing paragraphs. This is real, user-provided content — not placeholder.
- **English translation**: the source document is Italian-only. The English version is an assistant translation of the user-provided text (same treatment as other translated body copy on this page — e.g. top1/top2/bottom1's real paragraphs) — not invented content, but not user-reviewed either. Flagged as a non-blocking open question below.
- **"RemoteNIF v2" wording**: the source document's opening sentence refers to "RemoteNIF v2", but the rest of the case study (title, headings, body copy) consistently uses "RemoteNIF"/"RemoteNif" with no version number. To stay consistent with the rest of the page, the spec drops "v2" from the rendered text — flagged as a judgment call, non-blocking open question below (revert if the version number was actually intentional).
- **Didascalia/legenda (caption) — explicitly deferred, per user decision**: the source document's caption text (full arrows = standard flow, dashed arrows = the two special flows) is **not** rendered in this unit, in any form (no `<SectionImage>` caption, no separate element). Revisit in a later pass.
- **Column proportions (confirmed with user)**: standard sitewide default — `lg:w-[46%]` text column, image column takes the rest (`lg:flex-1` via `SectionImage`'s `widthClassName` prop, per the retrofit already done in 09e). Mirrored from bottom1: there, text was `46%`/first and image was narrowed to `38%`/second; here, image is first/left at `flex-1` and text is second/right at `46%`.
- **Heading**: `## Architecture` / `## Architettura` — nested inside the text column (right side), same structural position as bottom1's `## The Process`/`## Il Processo` (first element inside the text column, `text-left` override against the page's centered default), not a full-width heading like bottom2's "Stripe – Case Study". This matches the mirrored-bottom1 pattern described above, since no mockup dictates otherwise.
- **`SectionImage` reuse**: `frame={false}` (real image, not a placeholder box — same treatment as `cartella-context-remotenif.png` and `stripe-mermaid-inglese2.png`), `lightbox={true}` (dense diagram with small labels, same treatment as every other real diagram on this page), no `caption` prop (per the deferred-didascalia decision above — `caption` is already optional per the 09e retrofit). `aspectClassName="aspect-[1540/1371]"` — exact pixel ratio of the real image file (no placeholder aspect estimate needed, the asset already exists).
- **`fillHeight`**: not used — bottom1's `fillHeight` was needed because its image was the _shorter_ sibling next to a long text column and had to stretch to match it. Here the image (1540×1371, near-square) is likely to be the _taller_ sibling given six paragraphs of dense text at 46% width; forcing it to stretch would distort a diagram that has real internal proportions to preserve. Row uses `lg:items-start` (top-aligned, no stretch), same as bottom2's Stripe row — not `lg:items-stretch` (bottom1's choice, for a different asset).

---

## Design

No mockup — layout is the sitewide two-column pattern (`ui_context.md` § Layout, and bottom1's precedent), mirrored.

1. Section wrapper: `<div className="flex flex-col lg:flex-row lg:items-start gap-[clamp(1.5rem,3vw,2.5rem)] mt-[clamp(2.5rem,5vw,4rem)]">` — same vertical rhythm (`mt-[clamp(2.5rem,5vw,4rem)]`) as every other major block on the page (top2's flow diagram, "Il Processo"'s row). Below `lg`: stacks, image above text. At `lg`+: image left, text right.

2. **Image column** (first child, `SectionImage`): `widthClassName="lg:flex-1"`, `aspectClassName="aspect-[1540/1371]"`, `frame={false}`, `lightbox={true}`, no `caption`. `src="/images/architettura-inglese-remotenif.png"`, real descriptive `alt` per locale (assistant-authored, since the image itself has no locale-specific text needing a literal transcription beyond describing the diagram).

3. **Text column** (second child, `<div className="w-full lg:w-[46%]">`):
   - `## Architecture` / `## Architettura`, `text-left` (overriding the page's centered default, same technique as bottom1's `## The Process`).
   - Six paragraphs of body text (the "versione estesa" content, translated per locale), standard `prose` styling — no custom component needed, plain Markdown with `**bold**` labels (the existing ancestor `.prose` wrapper already styles `<strong>` via `prose-strong:text-heading`, set up in unit 09c's simplification pass — no new styling work required).

4. No responsive breakpoint tuning beyond the single structural switch already named (`lg:flex-row`, stacked below it) — consistent with every other section on this page.

---

## Implementation

1. `content/projects/en/remote-nif.mdx`: insert a new block immediately after the existing `<SectionImage src="/images/END-TO-END.png" .../>` element and before the `<div className="flex flex-col lg:flex-row lg:items-stretch ...">` wrapper that starts "The Process" section:
   - `<div className="flex flex-col lg:flex-row lg:items-start gap-[clamp(1.5rem,3vw,2.5rem)] mt-[clamp(2.5rem,5vw,4rem)]">` containing, in order:
     - `<SectionImage src="/images/architettura-inglese-remotenif.png" alt="..." aspectClassName="aspect-[1540/1371]" widthClassName="lg:flex-1" lightbox={true} frame={false} />`
     - `<div className="w-full lg:w-[46%]"><h2 className="text-left">Architecture</h2>` followed by the six translated paragraphs, `</div>`

2. `content/projects/it/remote-nif.mdx`: same structural insertion, Italian heading (`Architettura`) and the six original Italian paragraphs from `context/portfolio-testo-architettura.md`'s "versione estesa" (verbatim, minus "v2" per the Architecture section's decision above).

3. No changes to `components/mdx/section-image.tsx`, `page.tsx`'s MDX `components` map, `lib/content.ts`, `types/project.ts`, or any `messages/*.json` file — this unit only adds MDX body content using components that already exist and are already registered.

4. Once this unit is verified working, delete `context/portfolio-testo-architettura.md` (per the user's own note that it's a temporary source document) — confirm with the user immediately before deleting, not silently.

---

## Dependencies

None — reuses `SectionImage`, already installed/registered.

---

## Scope Limits

- Only the Architecture section (diagram image + six-paragraph text) — no didascalia/legend/caption element (explicitly deferred, see Architecture section above).
- Don't touch `components/mdx/section-image.tsx`, `legend-box.tsx`, `callout.tsx`, `dashboard-gallery.tsx`, or `flow-diagram` — no component changes needed, this unit only adds MDX content.
- Don't touch the TOC sidebar (still deferred, per 09b/09d/09e).
- Don't reorder or modify any existing section (top1/top2/bottom1/bottom2) beyond inserting this new block between top2's flow diagram and bottom1's heading.
- Don't delete `context/portfolio-testo-architettura.md` without confirming with the user first, even though the source document itself says it will eventually be removed.

---

## Check When Done

- Visiting `/en/project/remote-nif` and `/it/project/remote-nif` renders, between the end-to-end flow diagram (top2) and "The Process"/"Il Processo" (bottom1): a two-column row with the architecture diagram image on the left (or above, stacked, below `lg`) and an "Architecture"/"Architettura" heading + six paragraphs of real text on the right (or below).
- Image renders from `/images/architettura-inglese-remotenif.png` at its real aspect ratio (`aspect-[1540/1371]`), no grey placeholder frame, opens in the lightbox on click.
- English paragraphs are a faithful translation of `context/portfolio-testo-architettura.md`'s "versione estesa" (minus "v2" in the opening sentence); Italian paragraphs match the source verbatim (minus "v2").
- No caption/didascalia text renders anywhere in this section.
- `npm run build` passes.

---

## Open Questions (non-blocking, must resolve before this unit is marked done)

- English translation of the six paragraphs is assistant-authored (source document is Italian-only) — not yet reviewed by the user. Confirm or correct once rendered.
- "RemoteNIF v2" in the source document's opening sentence was rendered as "RemoteNIF" (no version number), to match the rest of the case study's consistent naming — flag if "v2" was actually intentional and should be kept.
- Whether the image ends up taller or shorter than the six-paragraph text column at `lg`+ (and whether that visual imbalance is acceptable) is unconfirmed — no `fillHeight`/stretch is applied, per the Architecture section's reasoning above; revisit if it reads badly once rendered.
- `alt` text for the diagram image is assistant-authored (no user-provided alt text), same treatment as every other diagram's `alt` on this page.
