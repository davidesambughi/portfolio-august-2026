<!-- Read before starting: AGENT.md, context/architecture_context.md, context/project_overview.md, context/user_flows.md, context/features/03-content-layer.md -->

# 09 — Project Detail Page (Pass A — Technical Foundation)

Add the dynamic `[slug]` route that statically renders a project's MDX case study for both locales, with no final visual design — that is Pass B.

---

## Architecture, rules and constraints

- Route: `/{locale}/project/{slug}` — `project` is a fixed, untranslated URL segment (decision, not inferred from any pathnames config; `i18n/routing.ts` has no `pathnames` entry, consistent with `localePrefix: 'always'` from unit 02). File location: `app/[locale]/project/[slug]/page.tsx`.
- `params` is a `Promise` in Next.js 16 (per `node_modules/next/dist/docs`) — must be `await`ed, not accessed synchronously.
- Data comes from `lib/content.ts`'s `getProjectBySlug(locale, slug)` (unit 03) — returns `Project | null` (`ProjectMeta & { content: string }`). **Do not modify `lib/content.ts`.**
- MDX rendering: `@mdx-js/mdx`'s `evaluate()` function, server-side, RSC-compatible. Input is the `content` string already returned by `getProjectBySlug()` — no new file-based MDX import mechanism.
  - **Not** `@next/mdx` — that package requires file-based `.mdx` imports, incompatible with the `gray-matter`-based frontmatter parsing already used in `lib/content.ts` (unit 03 already ruled this out when choosing `gray-matter`).
  - **Not** `next-mdx-remote` — archived/unmaintained.
- `generateStaticParams` must cover the full `locale × slug` matrix, so every real project is statically prerendered for both `en` and `it` (per `dynamic-routes.md` / `generate-static-params.md` — return one object per combination, e.g. `{ locale, slug }`).
- If `getProjectBySlug(locale, slug)` returns `null`, call `notFound()` (from `next/navigation`). No custom 404 UI here — the actual 404 page is unit 10; this unit only needs to trigger Next's default not-found behavior correctly.
- GitHub link source: `githubUrl` field on `ProjectMeta` (already defined in `types/project.ts`, optional). Render only if present.
- "Back to homepage" link and the GitHub link both use the locale-aware `Link` from `i18n/navigation.ts` (`createNavigation`), consistent with every other internal link in the codebase (e.g. `components/projects-section.tsx`'s card link to `/project/{slug}`) — GitHub's link is external, so it uses a plain `<a>` with `target="_blank" rel="noopener noreferrer"`, not the locale-aware `Link`.
- Per `user_flows.md` (Flow 2): there is no "all projects" index page — this detail page is reached only via a homepage card or a direct shared URL. No prev/next project navigation, no related-projects list.
- Content is still unit 03's placeholder MDX (`content/projects/{locale}/example-project.mdx`) — this unit does not add or edit project content.
- Runtime: `evaluate()` from `@mdx-js/mdx` requires the full Node.js runtime, not Edge. Verified: no `export const runtime = 'edge'` exists anywhere upstream of this route — the only layout in the tree is `app/[locale]/layout.tsx` (no `app/layout.tsx` at root), and neither it nor `next.config.ts` sets a runtime override. Default Node.js runtime applies.

---

## Design

Minimal, provisional shell only — not the final visual design (that is Pass B, done later against a mockup, following the same pixel-fidelity process as prior sections).

- Single column.
- Standard site container: `max-w-[1800px]` centered, fluid horizontal padding via `clamp()` (same pattern as every other section, per `ui_context.md`'s "Layout — container globale").
- MDX body wrapped in Tailwind Typography's `prose` class for readable default typography — no custom `mdx-components.tsx` component overrides, no site-specific heading/color styling beyond what `prose` gives by default.
- "Back to homepage" link and GitHub link (when present): plain text/inline links, no button styling, no icons, no positioning polish.
- No hero image, no cover image, no metadata badges (year/techStack/accentColor from `ProjectMeta`) rendered in this pass — those are Pass B.
- No responsive breakpoint tuning beyond what the shared container already provides.

---

## Implementation

1. Install `@mdx-js/mdx` and `@tailwindcss/typography` (see Dependencies).

2. Register `@tailwindcss/typography` as a Tailwind plugin (per current Tailwind CSS 4.1.x docs — CSS-based `@plugin` directive in `app/globals.css`, not a JS config file, unless the current docs say otherwise; verify before implementing).

3. Create `app/[locale]/project/[slug]/page.tsx`:
   - `generateStaticParams()`: returns `{ locale, slug }` for every combination of `routing.locales` (from `i18n/routing.ts`) and `getProjectSlugs()` (from `lib/content.ts`).
   - Default export: `async function Page({ params })` — `await params` to get `{ locale, slug }`.
   - Call `getProjectBySlug(locale, slug)`; if `null`, call `notFound()`.
   - Compile the project's `content` string with `@mdx-js/mdx`'s `evaluate()`, using the appropriate React 19/RSC runtime import (verify the exact import path against the installed `@mdx-js/mdx` package's own docs/types before implementing).
   - Render the compiled MDX component inside the `prose` wrapper described in Design.
   - Render the "back to homepage" `Link` (locale-aware, targets `/`) and, if `githubUrl` is present, an external `<a>` link to it.

4. Add minimal `page.tsx`-local strings ("Back to homepage" / GitHub link label) to `messages/en.json` / `messages/it.json` under a new `projectDetail.*` namespace (e.g. `backToHome`, `viewOnGithub`).

---

## Dependencies

Install: `@mdx-js/mdx`, `@tailwindcss/typography`

---

## Scope Limits

- No final visual design — layout is a provisional single-column `prose` shell only. Real layout comes in Pass B, against a mockup.
- No real case study content — placeholder MDX from unit 03 stays as-is.
- No real 404 page — `notFound()` is called, but building the actual not-found UI is unit 10.
- No `mdx-components.tsx` custom component overrides (headings, images, code blocks, etc.) — default `prose` styling only.
- No cover image, badges, metadata display (year, techStack, accentColor) on the detail page — Pass B.
- No prev/next project navigation, no related projects, no breadcrumbs.
- No CV-not-reachable handling (open question in `user_flows.md`, out of scope here).
- No `remark-gfm` or other remark/rehype plugins — placeholder content has no extended Markdown (tables, etc.). Revisit in Pass B only if the real case study content needs GFM features.
- Keep this focused on: the route, `generateStaticParams`, MDX compilation via `evaluate()`, `notFound()` wiring, and the two provisional links.

---

## Check When Done

- `app/[locale]/project/[slug]/page.tsx` exists and exports `generateStaticParams` covering both locales × the real project slug(s).
- Visiting `/en/project/example-project` and `/it/project/example-project` renders the placeholder MDX content inside a `prose` block, in the correct locale.
- Visiting a non-existent slug (e.g. `/en/project/does-not-exist`) triggers `notFound()` (renders Next's default not-found output, since unit 10 doesn't exist yet).
- "Back to homepage" link navigates to `/{locale}`.
- GitHub link renders and points to the placeholder project's `githubUrl` (only if the frontmatter field is set).
- `messages/en.json` / `messages/it.json` contain the new `projectDetail.*` namespace, no raw translation keys visible on either locale.
- `npm run build` passes.
