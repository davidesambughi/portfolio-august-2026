## This file has to be written precisely, clearly , and concisely. Do not add , assume or invent, but ask for more information if you need it .

# 09b — Project Detail Page: Top1 (Header, Intro, Callout)

<!-- Read before starting: AGENTS.md, context/architecture_context.md, context/ui_context.md, context/features/09-project-detail-page.md, context/features/03-content-layer.md -->

Build the first visual slice of the Project Detail Page's real design (Pass B, split into position-based microfasi per user request) — the page header (title + tech/methodology subtitle), a static two-column intro (case-study text + hero screenshot), and a full-width blue callout listing roles / state machines / dashboards — replacing Pass A's bare `prose` shell for this portion of the page, against `public/images/top1.png`.

---

## Architecture, rules and constraints

- Builds on unit 09 Pass A (`app/[locale]/project/[slug]/page.tsx`, `generateStaticParams`, `getProjectBySlug`, `notFound()`, `evaluate()`-based MDX compilation) — those mechanics are unchanged, only the rendering inside the page changes.
- **Reopens a Pass A Scope Limit**: Pass A explicitly excluded `mdx-components.tsx`/custom MDX component overrides. This unit introduces a small custom-components map (`Callout`, `CalloutItem`) passed to the compiled `MDXContent` via its `components` prop (per `@mdx-js/mdx`'s `evaluate()` API — verify the exact prop-passing mechanism against the installed `@mdx-js/mdx@3.1.1` types before implementing, per `AGENTS.md`'s doc-check rule). This is **not** `@next/mdx`'s file-based override mechanism (still correctly excluded) — it's components authored as JSX directly inside the case study's own `.mdx` body and resolved via the map at render time.
- **Content model decision (confirmed with user)**: the header (title, subtitle tags) and hero image come from `ProjectMeta` frontmatter (structured data); the two intro paragraphs and the callout are written directly in the MDX body of the case study — paragraphs as plain markdown, the callout as custom JSX (`<Callout>`/`<CalloutItem>`) inside the `.mdx` source.
- **New `ProjectMeta` field**: `subtitleTags: string[]` — the full ordered list rendered under the title (mixes real tech names and methodology/notes, e.g. "Next.js", "Claude Code", "Spec-Driven Development", "SEO & GEO opt."). Kept separate from the existing `techStack: string[]` field, which stays tech-only (unchanged usage: homepage card badges). Add to `types/project.ts`.
- **Layout decision — revised during implementation (confirmed with user)**: originally specced as a static two-column layout (flex/grid, no float). Implementation hit a real conflict: the intro paragraphs and the `Callout` come from the same MDX content stream, so if the callout must become full-width relative to the page's standard container (not just the two-column row), it has to break out of whatever column contains the paragraphs — not cleanly achievable with plain flex/grid without either a fragile CSS-Grid auto-placement scheme (breaks if the paragraph count ever changes) or reintroducing float. Resolved: the hero image (`coverImage`) is **CSS float** (`lg:float-right`), with the MDX paragraphs flowing around it as normal inline content; the `Callout` component clears the float (`clear-both`) so it naturally spans the full container width once past the image. This is the same float mechanism already planned for later sections (SDD/Prodotto/War-story) — applied here now rather than only later, since it's what actually makes this block's requirements work.
- **Column proportions**: hero image floated at `lg:w-[42%]` (right side), measured from `public/images/top1.png` as roughly 40% of the row's width — approximate (mid-fi mockup, not pixel-exact), adjust visually once rendered. No explicit width needed for the text side — floated-around text naturally fills the remaining space.
- **Hero image**: reuses the existing `coverImage` field (no new field) — same asset shown larger here than on the homepage card. No real screenshot asset exists yet (`public/images/projects/` is empty) — renders via `next/image` on a `bg-muted` fallback, `object-contain` (per the user's global default preference, `contain` over `cover` unless told otherwise — corrected during implementation, initial draft wrongly used `object-cover` copying unit 05's pattern without checking). Aspect ratio read from the mockup's screenshot box ≈ `19/10` — approximate, revisit once a real screenshot exists.
- **Callout background color**: must come from the existing `--color-accent-blue` CSS custom property (never hardcoded), using a tint (e.g. Tailwind opacity modifier `bg-accent-blue/10`) since the mockup shows a pale blue, not the fully-saturated token — verify the opacity-modifier syntax against current Tailwind CSS v4.1.x docs before implementing (per `ui_context.md`'s general doc-check rule), since it depends on how the token is registered as a Tailwind color.
- **Callout icons**: generic UI icons, not tech logos → `lucide-react` (per `architecture_context.md`'s existing split: Simple Icons for tech/brand logos, lucide-react for generic UI icons). `CalloutItem` takes an `icon` prop as a string key (e.g. `"users"`, `"workflow"`, `"layout-dashboard"`) resolved to a Lucide component via a small internal map — chosen so `.mdx` authors don't need to import React components inside the MDX body. Exact icon choice is a reversible visual decision, not user-specified — flagged below for confirmation rather than blocking.
- **Real project content, replacing the placeholder** (confirmed with user): `content/projects/en/example-project.mdx` and `content/projects/it/example-project.mdx` are renamed/rewritten to `remote-nif.mdx` (slug `remote-nif`) — this is the same slot, not a second project, so the homepage grid is unaffected (still 1 real card + 2 filler cards). `lib/content.ts` is not modified (still reads whatever `.mdx` files exist under `content/projects/{locale}/`).
- **Frontmatter values for `remote-nif`** (real, not placeholder):
  - `title`: `"RemoteNIF"`
  - `techStack`: `["Next.js", "Supabase", "Drizzle ORM", "Stripe", "Resend", "next-intl", "Zod", "Groq"]`
  - `subtitleTags`: `["Next.js", "Supabase", "Drizzle ORM", "Stripe", "Resend", "Next-Intl", "Zod", "Groq", "Claude Code", "Spec-Driven Development", "SEO & GEO opt."]` (typos in the mockup annotation — "claide code", "developmetn" — corrected here)
  - `year`: `2026` (confirmed by user)
  - `coverImage`: `"/images/projects/remote-nif/cover.png"` (file does not exist yet, same non-blocking gap as unit 05's placeholder)
  - `githubUrl`: left unset for now (confirmed by user) — Pass A only renders the link when present, so no link renders on this page until provided
  - `accentColor`: `"blue"` — judgment call (decorative token, arbitrary; also coherent with the callout's fixed accent-blue), flagged for confirmation rather than blocking
  - `summary`: the caption text already written by the user on the mockup ("RemoteNIF è un'applicazione web full-stack, ottimizzata SEO/GEO (search e generative engine optimization) disponibile in 4 lingue (Inglese, Spagnolo, Francese e Tedesco)") for `it`; an English translation of the same sentence for `en` (translation of user-provided text, not invented content)
- **MDX body content for `remote-nif`** (real, not placeholder): the two Italian paragraphs already written by the user on the mockup (NIF explanation) as the `it` file's body text, plus an English translation for the `en` file's body text — followed by the `<Callout>` block.
- **Callout item copy**: confirmed with user as **placeholder for now** (roles, state-machine description, dashboard list are not yet written) — logged as a non-blocking open question, same treatment as other placeholder copy across the site (Hero body, About paragraphs, etc.).
- TOC sidebar (annotated in the mockup, left margin, desktop-only): explicitly **out of scope** for this unit (confirmed with user) — deferred to its own later microfase once all page sections exist.

---

## Design

Per `public/images/top1.png`. Pixel-measured proportions from the mockup are approximate (mid-fi, not a final hi-fi comp) but close, not just "similar" — treat the ratios below as the real target, not a rough guess to fill in with framework defaults.

1. **Header** — **centered** (confirmed with user, a deliberate deviation from the sitewide left-align convention used elsewhere, e.g. Hero/About — matches the editorial/textbook reference style): `title` (`RemoteNIF`) as a bold, centered `h1` (`--color-heading`); `subtitleTags` on a centered line below it, joined with `" · "` (`--color-body`, smaller/regular weight, no per-tag styling — plain joined string).
2. **Intro block** (below `lg`: image stacks above text, no float — float only applies `lg:` and up, consistent with every other section's structural breakpoint):
   - Hero image: `lg:float-right`, `lg:w-[42%]`, `next/image` with `bg-muted` fallback, `aspect-[19/10]`, floated margin (`lg:ml-[clamp(1.5rem,3vw,2.5rem)] lg:mb-[clamp(1rem,2vw,1.5rem)]`) so text doesn't hug it. A caption below the image (inside the same floated box), **centered**, using the `summary` field text (`--color-body`, smaller size).
   - The two MDX-rendered paragraphs flow around the floated image as normal text, **center-aligned** (confirmed with user — deviates from `prose`'s default left-align; applied via a `text-center` wrapper, not per-element overrides).
3. **Callout**: rendered via the `Callout` MDX component, `clear-both` so it always starts below the floated image regardless of paragraph length, making it **full-width relative to the page's standard container** (confirmed with user) once cleared. `bg-accent-blue/10` background, padding `p-[clamp(1.5rem,3vw,2.5rem)]`, `rounded-[24px]` (explicit pixel radius, not the sitewide pill token — same reasoning as unit 04's collage blocks: a large rectangular content block shouldn't clip to a pill). Three `CalloutItem` rows stacked vertically, left-aligned within the box (icon + bold label + description per the mockup's `[icona] **label** — description` pattern), row gap `gap-[clamp(0.75rem,1.5vw,1.25rem)]`.
   - Vertical spacing: `mt-[clamp(2.5rem,5vw,4rem)]` above the callout (already part of the `Callout` component's own styling); the header→intro gap uses the same value for consistency (no separate value observed in the mockup to justify a different one).
4. No hero cover image beyond what's described above, no metadata badges — everything else from Pass A's Design section (single column, standard site container, no responsive polish beyond structural breakpoint) still applies.

---

## Implementation

1. `types/project.ts`: add `subtitleTags: string[]` to `ProjectMeta`.

2. Rename `content/projects/en/example-project.mdx` → `content/projects/en/remote-nif.mdx` and `content/projects/it/example-project.mdx` → `content/projects/it/remote-nif.mdx`. Replace frontmatter and body with the real values listed in Architecture above (both locales) — leave `year` and `githubUrl` as placeholders/TODO markers until answered (see Open Questions).

3. Create `components/mdx/callout.tsx`:
   - `Callout` — wraps children in the full-width styled container described in Design.
   - `CalloutItem` — props `icon: string`, `label: string`, `children: ReactNode`; renders icon + bold label + description per Design. Internal icon-name → Lucide component map covering at least `"users"`, `"workflow"`, `"layout-dashboard"`.

4. `app/[locale]/project/[slug]/page.tsx`:
   - Pass `{ Callout, CalloutItem }` as the `components` option to the compiled MDX content (per the verified `@mdx-js/mdx` API for supplying a components map to `evaluate()`/the returned component).
   - Render the header (title + joined `subtitleTags`) above the MDX content, centered.
   - Render the floated hero image (`coverImage` + caption) as a sibling immediately before a `text-center` wrapper containing `<MDXContent components={...} />` — the float, being a preceding sibling in the same block formatting context, makes the MDX paragraphs wrap around it and the `Callout` (via its own `clear-both`) drop below it at full container width, with no grid/flex trickery needed.

5. Add any new `messages/en.json`/`it.json` strings only if literal UI chrome text is needed beyond what MDX/frontmatter already provides (none currently identified — flag if one turns out to be needed during implementation).

---

## Dependencies

Install: `lucide-react` (verify not already installed before adding — `architecture_context.md` already lists it as used for generic UI icons, so it may already be a dependency; check `package.json` first)

---

## Scope Limits

- Only the header, two-column intro, and callout — not the dashboard screenshots/happy-path list/flow diagram (top2), not the SDD/Prodotto/Architettura/War-story/Link sections (later microfasi), not the TOC sidebar.
- No float-based text-wrap layout — that treatment is reserved for later sections per user's explicit constraint, not used here.
- No real screenshot asset for `coverImage` — placeholder `bg-muted` fallback only.
- No final copy for the callout's roles/state-machine/dashboard text — placeholder only, logged as open question.
- Don't touch `lib/content.ts`, `generateStaticParams`, or Pass A's `notFound()`/routing logic — unchanged.
- Don't add a second project — `remote-nif.mdx` replaces `example-project.mdx` in the same slot.
- Don't build the TOC sidebar shell — fully deferred, not even a placeholder element.

---

## Check When Done

- `types/project.ts` has `subtitleTags: string[]` on `ProjectMeta`.
- `content/projects/{en,it}/remote-nif.mdx` exist (old `example-project.mdx` files removed), both with real frontmatter/body per Architecture.
- Visiting `/en/project/remote-nif` and `/it/project/remote-nif` renders: title, subtitle tag line, two-column intro (paragraphs left, screenshot placeholder + caption right, ~60/40 at `lg`+ and stacked below), and the full-width blue callout with 3 icon rows — in the correct locale.
- Visiting `/en/project/example-project` now 404s (slug no longer exists).
- `components/mdx/callout.tsx` exports `Callout`/`CalloutItem`, used only via the MDX `components` map (not imported/rendered directly in `page.tsx`'s own JSX).
- Callout background color traces to `--color-accent-blue` (no hardcoded hex/oklch in the component).
- `npm run build` passes.

---

## Open Questions (non-blocking, must resolve before this unit is marked done)

- Callout icon choices (`users` / `workflow` / `layout-dashboard`) are an assistant judgment call — confirm or change.
- `accentColor: "blue"` for `remote-nif` is an assistant judgment call — confirm or change.
- Callout item copy (roles + descriptions, state-machine description, dashboard list) is placeholder text — replace when real copy is provided.
