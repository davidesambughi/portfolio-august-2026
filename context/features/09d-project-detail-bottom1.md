## This file has to be written precisely, clearly , and concisely. Do not add , assume or invent, but ask for more information if you need it .

# 09d — Project Detail Page: Bottom1 (Process Section — Heading, Text, Two Images)

<!-- Read before starting: AGENTS.md, context/architecture_context.md, context/ui_context.md, context/features/09-project-detail-page.md, context/features/09b-project-detail-top1.md, context/features/09c-project-detail-top2.md -->

Build the third visual slice of the Project Detail Page's real design (Pass B, position-based microfase, continuing after top1/top2) — the first true section heading of the case study body ("Il Processo" / "The Process"), a two-column text+captioned-image row, and a full-width process-diagram image with caption, against `public/images/bottom1.png`.

---

## Architecture, rules and constraints

- Builds on unit 09 Pass A (routing/MDX mechanics, unchanged) and 09b/09c (`Callout`, `DashboardGallery`, `FlowDiagram`, the page's ancestor `.prose` wrapper with `text-center` default + `prose-strong:text-heading prose-li:text-body [&_ol>li::marker]:font-bold [&_ol>li::marker]:text-heading` modifiers already applied in `page.tsx`). No changes to Pass A's routing/data mechanics.
- **Content model**: same as top2 — everything in this unit is authored directly inside the case study's `.mdx` body, appended after top2's `<FlowDiagram>`. No new `ProjectMeta` frontmatter fields, no `types/project.ts`/`lib/content.ts` changes.
- **First section heading, confirmed with user**: `## Il Processo` / `## The Process` — an **H2**, MDX standard markdown heading (the mockup's own annotation, "HEADING2 O H3", left the level undecided; user confirmed H2 — first sub-section of the case study body, directly below the page's H1 project title). Styled by `prose` defaults (no custom heading component).
- **Text alignment, mixed within the same column (confirmed with user after re-checking the mockup pixel-by-pixel)**: the heading is left-aligned (flush with the column's left edge), but the two paragraphs below it are **centered** — their line lengths are ragged on both sides (e.g. "Risultato :" starts noticeably right of the heading's "I", and the last line of the first paragraph is short and indented), not flush-left like the heading. This is a different treatment from top1 (whole intro block centered together) and from top2's steps column (whole block left-aligned together) — here the heading and its paragraphs are styled independently. Implemented as: the wrapping column keeps the page's default `text-center` inheritance (no `text-left` override at the column level, unlike top2); the H2 alone gets an explicit `text-left` class so it breaks from the inherited center.
- **TOC sidebar (confirmed with user, non-blocking)**: `bottom1.png` re-annotates the expandable, desktop-only TOC sidebar (left margin, "naviga a heading") — same annotation seen on `top1.png`. Per user decision, **still deferred**, same as 09b's Scope Limit — this unit's new H2 becomes the first real navigation target for that future TOC, but no sidebar element (not even a placeholder) is built here.
- **Real content, not placeholder (confirmed with user)**: the two paragraphs under the heading were written by the user directly on the mockup, with two typos corrected here (`attrverso le psec-driv development` → `attraverso lo spec-driven development`; `il sistema context/:` → `il sistema context/ —`), same treatment as top1's `subtitleTags` typo correction. English is a translation of this corrected Italian text (translation of user-provided text, not invented — same treatment as `summary`/the top1 intro paragraphs). Exact text:
  - **IT**: "**Obiettivo:** applicare le classiche fasi del SDLC e integrare nello sviluppo l'intelligenza artificiale in maniera ingegneristica e sistematica, attraverso lo spec-driven development e il context engineering." / "**Risultato:** il sistema context/ — una directory localizzata alla radice del progetto contenente 10 documenti in formato Markdown. Questo sistema rappresenta la 'memoria a lungo termine' e la fonte della verità dell'applicazione, letta obbligatoriamente dall'agente all'inizio di ogni sessione."
  - **EN**: "**Objective:** apply the classic phases of the SDLC and integrate artificial intelligence into development in an engineered, systematic way, through spec-driven development and context engineering." / "**Result:** the context/ system — a directory located at the project's root containing 10 Markdown documents. This system represents the application's 'long-term memory' and source of truth, read mandatorily by the agent at the start of every session."
  - Both paragraphs use a leading bold label (`**Obiettivo:**`/`**Risultato:**`, `**Objective:**`/`**Result:**`) written as plain Markdown `**...**` — already renders bold + `--color-heading` via `page.tsx`'s existing `prose-strong:text-heading` modifier (from 09c), no new styling needed.
- **New component, `components/mdx/section-image.tsx`**: `SectionImage` — props `src: string`, `alt: string`, `caption: string`, `aspectClassName: string` (e.g. `"aspect-[4/3]"` — passed explicitly per instance rather than hardcoded, since this component is generic enough that a later microfase may reuse it with a different image shape). Renders a single captioned image box (`not-prose`, `bg-muted` fallback, `next/image` `fill object-contain`, `rounded-[20px]`, small centered caption below) — same visual treatment as `DashboardGallery`'s individual boxes and top1's hero image, factored out as its own component because this shape (one image + caption, sized as a flex sibling to a text column) is new and distinct from `DashboardGallery`'s fixed 3-box collage and `FlowDiagram`'s always-full-width image.
- **Bottom full-width image reuses the existing `FlowDiagram` component as-is** (already registered in `page.tsx`'s MDX `components` map from unit 09c) — same shape (full-width image, `bg-muted`, `object-contain`, `rounded-[24px]`, centered caption below), no new component needed for this box.
- **Two-column proportions**: text column `lg:w-[46%]` (same value already used for Hero/About). Image column originally followed `ui_context.md`'s documented default (`lg:flex-1`, filling remaining space) — **revised same session, per user feedback that the image read too large relative to the text column**: changed to a fixed `lg:w-[38%]` (~30% narrower than the ~54% `flex-1` produced), height still driven by `aspectClassName`. Same precedent as unit 8a's About mosaic (`lg:flex-1` → fixed `lg:w-[40%]` for the same "too large" feedback) — leaves some empty space to the row's right on very wide screens, accepted as the simplest fix for the exact request.
- **Blue dashed vertical line in the mockup**: a mockup-tool alignment guide, not real UI — same category of artifact already confirmed in unit 08 (dark background) and unit 09 (grey device-frame bars). Not rendered.
- **"DIDASCALIA IMMAGINE SOPRA" mockup labels**: instructional placeholder text ("caption for the image above"), not real caption copy — both captions in this unit (the side image's and the process-diagram's) are assistant-authored placeholder strings, same treatment as top2's dashboard/flow-diagram captions. Logged as a non-blocking open question.
- **Placeholder image paths**: `/images/projects/remote-nif/context-folder.png` (side image) and `/images/projects/remote-nif/process-diagram.png` (bottom full-width image) — files do not need to exist yet, same non-blocking gap as `coverImage`/top2's dashboard images, `bg-muted` fallback via `next/image`.

---

## Design

Per `public/images/bottom1.png`. Mid-fi mockup — proportions below are a direction, not pixel-exact; adjust visually once rendered.

1. **Outer row** (shared flex container wrapping the heading+text column and the side image, authored in the `.mdx` body): `flex flex-col lg:flex-row lg:items-start gap-[clamp(1.5rem,3vw,2.5rem)] mt-[clamp(2.5rem,5vw,4rem)]` — same vertical rhythm value used above every major block on this page (Callout, the top2 two-column row, FlowDiagram). **Not** `not-prose` on this outer wrapper (lesson from 09c — scope `not-prose` only to `SectionImage` itself, which contains the `<img>`; the heading/paragraphs need normal `prose` styling). Below `lg`: stacks, heading+text column first (full width), image column below it (full width). At `lg`+: side by side.

2. **Heading + text column** (`w-full lg:w-[46%]`, first flex child, **no column-level text-alignment override** — see Architecture's Text alignment note):
   - `## Il Processo` / `## The Process` — H2, default `prose` heading styles (bold, `--color-heading` via prose defaults), with an explicit `text-left` class on the heading itself (breaking from the page's inherited `text-center`).
   - Two paragraphs below it (Obiettivo/Risultato — exact text in Architecture), plain `prose` paragraph styling, **centered** (inherits the page's default `text-center` — no override needed), bold lead-in label via the page's existing `prose-strong:text-heading` modifier.

3. **Side image** (`SectionImage`, second flex child, `w-full lg:w-[38%]` — see the Architecture revision note): one captioned image box, `aspectClassName="aspect-[4/3]"` (approximate — the mockup's folder-screenshot placeholder box reads roughly landscape/4:3, not measured to the pixel), `rounded-[20px]`, `bg-muted` fallback, `next/image` `fill object-contain`, caption below (`text-sm text-body`, centered) — placeholder caption text for now.

4. **Process-diagram image** (`FlowDiagram`, reused as-is, outside/after the two-column row): full-width relative to the page's standard container, same component/props/styling already used for top2's flow diagram (`aspect-[16/7]`, `rounded-[24px]`, `bg-muted`, centered caption, `mt-[clamp(2.5rem,5vw,4rem)]` top margin) — placeholder `src`/`alt`/`caption` for this unit's own process-diagram image, distinct from top2's happy-path flow diagram.

5. No responsive breakpoint tuning beyond the single structural switch already named (two-column at `lg`, stacked below it) — consistent with the sitewide rule.

---

## Implementation

1. Create `components/mdx/section-image.tsx`:
   - Export `SectionImage` (props `src`, `alt`, `caption`, `aspectClassName`, as listed in Architecture) rendering the single captioned image box described in Design.

2. `app/[locale]/project/[slug]/page.tsx`: add `SectionImage` to the `components` map passed to the compiled MDX content (alongside `Callout`, `CalloutItem`, `DashboardGallery`, `FlowDiagram`). No other changes to `page.tsx`.

3. `content/projects/en/remote-nif.mdx` and `content/projects/it/remote-nif.mdx`: append, after the existing `<FlowDiagram>` block (top2's):
   - A `<div className="flex flex-col lg:flex-row lg:items-start gap-[clamp(1.5rem,3vw,2.5rem)] mt-[clamp(2.5rem,5vw,4rem)]">` wrapping:
     - A `<div className="w-full lg:w-[46%]">` (no text-alignment class — inherits the page's `text-center`) containing `## Il Processo`/`## The Process` written with an explicit `text-left` class (e.g. as raw JSX `<h2 className="text-left">...</h2>` rather than plain `##` Markdown, since Markdown headings can't carry a class) and the two real paragraphs as plain Markdown (exact text per Architecture, per locale), left to inherit the centered alignment.
     - `<SectionImage src="/images/projects/remote-nif/context-folder.png" alt="..." caption="..." aspectClassName="aspect-[4/3]" />` with a real descriptive `alt` and a placeholder `caption` (per locale).
   - `<FlowDiagram src="/images/projects/remote-nif/process-diagram.png" alt="..." caption="..." />` (outside/after the two-column row) with a placeholder `alt`/`caption` (per locale) — a second, distinct use of the same component already used in top2.

4. No `messages/en.json`/`messages/it.json` changes — all new text in this unit is per-project MDX/component-prop content, consistent with top1/top2.

---

## Scope Limits

- Only the "Il Processo" heading, its two-column text+image row, and the full-width process-diagram image — not the TOC sidebar (confirmed deferred), not any later semantic section (SDD/Prodotto/Architettura/War-story/Link — still undefined, see Open Questions), not the top1/top2 content.
- No real screenshot or diagram assets — `bg-muted` fallback placeholders only, same as top1/top2.
- No real caption copy for either image — placeholder text only, logged as an open question.
- No new `ProjectMeta` fields, no `types/project.ts`/`lib/content.ts` changes, no changes to Pass A's routing/`generateStaticParams`/`notFound()` logic.
- Don't touch `components/mdx/callout.tsx` or `components/mdx/dashboard-gallery.tsx` beyond registering `SectionImage` alongside them in `page.tsx`'s MDX `components` map.
- Don't build any TOC sidebar element, not even a placeholder — fully deferred per user decision this unit.

---

## Check When Done

- `components/mdx/section-image.tsx` exports `SectionImage`, used only via the MDX `components` map (not imported/rendered directly in `page.tsx`'s own JSX), matching `Callout`/`DashboardGallery`'s existing pattern.
- Visiting `/en/project/remote-nif` and `/it/project/remote-nif` renders, below top2's flow diagram: a left-aligned "Il Processo"/"The Process" H2 followed by two **centered** paragraphs (bold "Obiettivo:"/"Risultato:" or "Objective:"/"Result:" lead-ins in black, rest in grey body text) in a `~46%`-width left column, a captioned placeholder image in the remaining right column (stacked full-width below `lg`), followed by a full-width process-diagram placeholder image with a visible centered caption — in the correct locale.
- The H2 renders left-aligned (explicit override) while the two paragraphs below it render centered (inherited from the page's default `text-center` MDX wrapper) — a deliberate mixed alignment within the same column, confirmed against the mockup.
- `npm run build` passes.

---

## Open Questions (non-blocking, must resolve before this unit is marked done)

- Side image's caption text and the process-diagram's `alt`/caption text are assistant-authored placeholders — confirm or change when real copy is available.
- Side image's `aspect-[4/3]` is an approximate read of the mockup's placeholder box, not measured to the pixel — revisit once a real screenshot exists.
- (carried over from 09b, still open) The "7 sections" semantic model (Hook / SDD / Prodotto / Architettura+invarianti / War story / Link) referenced by the user earlier is still not recorded in any `context/` file — this unit's "Il Processo" section plausibly maps to "SDD," but that mapping has not been confirmed by the user. Continuing to build by visual position (top1, top2, bottom1, ...) rather than guess the mapping.
