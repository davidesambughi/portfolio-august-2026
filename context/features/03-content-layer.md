<!-- Read before starting: AGENT.md, context/architecture_context.md, context/project_overview.md, context/user_flows.md -->

# 03 — Content Layer

Introduce the typed content layer (types, data files, MDX case studies, and read functions) that later units will render — no UI consumes it yet.

---

## Architecture, rules and constraints

- Follows the Content Model table in `architecture_context.md`:
  - **Experience / Education** → `content/data/experience.ts` and `content/data/education.ts`, one file per type, one array entry per item. Only the textual fields that are actually language-dependent are translated inline as `{ en, it }`; everything else (dates, company name, institution name) is stored once, not duplicated.
  - **Projects (long-form case study)** → `content/projects/{locale}/{slug}.mdx`, one MDX file per language per project (per next-intl's own recommendation for long-form content, per `architecture_context.md`). Because each locale already has its own file, project metadata (title, summary, tech stack, etc.) does **not** need an `{ en, it }` wrapper — it lives directly in that file's frontmatter.
- No MDX rendering/compilation library is named here. Next.js 16.3 + MDX integration must be verified against current official docs before anything is installed (per `AGENT.md` — this stack is newer than training data). This unit only reads frontmatter + raw MDX source; actually rendering MDX to React is unit 07's job.
- Server-side only, static site — `lib/content.ts` functions run at build time (used later by `generateStaticParams` and Server Components), no client-side data fetching.
- `content/`, `lib/`, `types/` already exist (empty) from unit 01.
- One project placeholder only, in both locales — real project case studies are added incrementally after this unit, not part of scope here.
- Experience and Education must contain the user's **real** data (per feature list — not placeholder). Provided — see Open Questions.

---

## Open Questions (resolved)

- Real Experience/Education data provided via `context/davide_cv_en.md` (EN) and `context/davide_cv_ita.md` (IT). Date format: `YYYY-MM` where the CV gives a month, `YYYY` otherwise (user decision).

---

## Implementation

1. Create `types/project.ts`:
   - `ProjectMeta`: `{ slug: string; title: string; summary: string; year: number; techStack: string[]; coverImage: string; githubUrl?: string; liveUrl?: string; accentColor: 'blue' | 'red' | 'yellow' | 'green' }` (accent values map to the decorative tokens in `ui_context.md`).
   - `Project`: `ProjectMeta & { content: string }` (raw MDX body, for the detail page in unit 07).

2. Create `types/experience.ts`:
   - `Experience`: `{ id: string; company: string; role: { en: string; it: string }; location?: string; startDate: string; endDate: string | null; description: { en: string; it: string } }` (`endDate: null` = current role, per `user_flows.md` "current role" requirement).

3. Create `types/education.ts`:
   - `Education`: `{ id: string; institution: string; degree: { en: string; it: string }; location?: string; startDate: string; endDate: string | null; description?: { en: string; it: string } }`.

4. Create `content/projects/en/example-project.mdx` and `content/projects/it/example-project.mdx`:
   - Frontmatter matching `ProjectMeta` (minus `slug`, derived from filename): generic placeholder title/summary/techStack/year/accentColor, `coverImage` pointing to a not-yet-existing placeholder path (e.g. `/images/projects/example-project/cover.png`) — no image asset added in this unit.
   - Minimal placeholder MDX body (a couple of headings/paragraphs) so `lib/content.ts` has real content to read and parse.

5. Create `content/data/experience.ts` and `content/data/education.ts`, exporting typed `const experience: Experience[]` / `const education: Education[]` arrays populated with the user's real data (see Open Questions).

6. Create `lib/content.ts`:
   - `getExperience(): Experience[]` — returns the imported array, sorted most-recent-first (`endDate: null` sorts first).
   - `getEducation(): Education[]` — returns the imported array, sorted most-recent-first.
   - `getProjectSlugs(): string[]` — reads filenames from `content/projects/en/` (locale used only as the enumeration source; both locales must have matching slugs).
   - `getProjects(locale: string): ProjectMeta[]` — reads and parses frontmatter for every slug in that locale's `content/projects/{locale}/` folder.
   - `getProjectBySlug(locale: string, slug: string): Project | null` — reads and parses one file's frontmatter + raw MDX body; returns `null` if missing (for unit 08's 404 handling later).

---

## Dependencies

- Frontmatter parsing needs a YAML/frontmatter-extraction package (e.g. the kind bundled with an MDX toolchain) — do not pick one from memory. Verify the current official Next.js 16.3 MDX integration guide first, then install whatever it recommends as part of implementation step 4/6.

---

## Scope Limits

- No MDX-to-React rendering/compilation — reading raw frontmatter + source only. Actual rendering is unit 07 (Project Detail Page).
- No UI reads from this content layer yet — units 04–06 wire the homepage sections, unit 07 wires the detail page.
- No image assets — `coverImage` paths in the placeholder project point to files that don't exist yet.
- No more than one placeholder project.
- No Italian translation pass beyond the placeholder project's own `it` MDX file — full localization of real case studies is unit 09.
- Keep this focused on: types, data files, one placeholder project's MDX, and the `lib/content.ts` read functions only.

---

## Check When Done

- `types/project.ts`, `types/experience.ts`, `types/education.ts` exist and match the shapes above.
- `content/data/experience.ts` and `content/data/education.ts` exist, export typed arrays, and contain the user's real data (not placeholders).
- `content/projects/en/example-project.mdx` and `content/projects/it/example-project.mdx` exist with valid frontmatter matching `ProjectMeta`.
- `lib/content.ts` exports `getExperience`, `getEducation`, `getProjectSlugs`, `getProjects`, `getProjectBySlug`, all correctly typed, no `any`.
- A throwaway script or test confirms `getProjects('en')` and `getProjects('it')` both return the placeholder project's metadata, and `getProjectBySlug('en', 'example-project')` returns non-null content.
- `npm run build` passes.
