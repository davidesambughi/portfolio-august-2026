## This file has to be written precisely, clearly , and concisely. Do not add , assume or invent, but ask for more information if you need it .

# 09j — Project Content Validation & Locale Parity

<!-- Read before starting: AGENTS.md, context/architecture_context.md, context/features/03-content-layer.md -->

Harden `lib/content.ts`'s project-reading functions so malformed frontmatter and missing per-locale MDX files fail loudly at build time instead of silently at runtime.

---

## Architecture, rules and constraints

- Content Model (`architecture_context.md`) is unchanged: projects stay as one MDX file per locale per project (`content/projects/{locale}/{slug}.mdx`), frontmatter holds `ProjectMeta`. This unit does not touch that model — it only adds guardrails around it.
- Two concrete gaps, both previously logged as known risk and never fixed:
  - `lib/content.ts` (`getProjects`, `getProjectBySlug`) casts frontmatter with `data as Omit<ProjectMeta, "slug">` — no runtime validation. A malformed frontmatter field is only caught when the page renders (or not caught at all).
  - `getProjectSlugs()` enumerates slugs from `content/projects/en/` only. If a project's `it/` file (or, symmetrically, an `en/` file) is missing, nothing fails — the other locale silently 404s on that project's detail page (`getProjectBySlug` already returns `null` for a missing file, which unit 09's page correctly turns into a 404 — the bug is that this can happen unnoticed, not that the 404 itself is unhandled).
- Locales are fixed and known (`i18n/routing.ts`: `["en", "it"]`) — the parity check compares against both of these explicitly, not by scanning arbitrary folders.
- Static site, build-time only: these functions already run at build time (`generateStaticParams`, Server Components) — failing via a thrown `Error` is the correct behavior (`npm run build` fails with a clear message), not a UI-level error state.
- Does not address content/structure drift between the two hand-maintained MDX bodies (headings, custom components, prose) — out of scope for this unit, per user decision.

---

## Implementation

1. Install `zod`.

2. Create `lib/project-schema.ts`:
   - Export `projectFrontmatterSchema`, a Zod object matching `ProjectMeta` minus `slug` (`title`, `summary`, `badgeLabel`, `techStack: string[]`, `subtitleTags: string[]`, `coverImage`, `githubUrl` optional, `liveUrl` optional, `accentColor: enum("blue" | "red" | "yellow" | "green")`) — mirror `types/project.ts` field-for-field, do not diverge from it.

3. Update `lib/content.ts`:
   - `getProjectSlugs()`: after reading filenames from `content/projects/en/`, also read `content/projects/it/`. If either locale has a slug the other doesn't, throw an `Error` listing the offending slug(s) and which locale is missing the file — do this before returning, so every caller benefits.
   - `getProjects(locale)` and `getProjectBySlug(locale, slug)`: replace the `data as Omit<ProjectMeta, "slug">` cast with `projectFrontmatterSchema.parse(data)`. Let Zod's thrown error propagate (do not catch/swallow it) — on invalid frontmatter this fails `npm run build` with Zod's field-level message, identifying the file.

4. Verify with the current real content (`remote-nif`, `raising-kids-in-portugal` — both locales already present and matching): `npm run build` still passes unchanged.

5. Verify the two failure paths actually fire, then revert:
   - Temporarily rename one locale's `.mdx` file for one project → `npm run build` fails with the new slug-parity error naming that file/locale → rename it back.
   - Temporarily remove a required field from one frontmatter block → `npm run build` fails with a Zod validation error naming that field/file → restore it.

---

## Dependencies

Install: `zod`

---

## Scope Limits

- Does not change how project content is authored — still two hand-maintained MDX files per project, one per locale. No merge into a single source file.
- Does not add a structural/heading/component-drift check between the two locale versions of a project's MDX body — flagged separately, not part of this unit.
- Does not touch Experience/Education/Skills/Contacts data — those already avoid duplication (`{ en, it }` fields on shared entries) and aren't affected by this gap.
- Does not change `types/project.ts`'s existing manually-written types to `z.infer<...>` — the Zod schema is a separate, parallel validation layer kept in sync by hand (field-for-field, per step 2), not a replacement for the type.
- Keep this focused on: the `zod` dependency, `lib/project-schema.ts`, and the three functions in `lib/content.ts` named above.

---

## Check When Done

- `zod` is in `package.json` dependencies.
- `lib/project-schema.ts` exists, exporting `projectFrontmatterSchema` matching `ProjectMeta` minus `slug`.
- `lib/content.ts` no longer contains `as Omit<ProjectMeta, "slug">` — both `getProjects` and `getProjectBySlug` validate via `projectFrontmatterSchema.parse`.
- `getProjectSlugs()` throws a descriptive error when a slug exists in one locale's folder but not the other's (verified per step 5, then reverted).
- Frontmatter missing a required field fails `npm run build` with a Zod error identifying the field (verified per step 5, then reverted).
- With current real content restored, `npm run build` passes.
