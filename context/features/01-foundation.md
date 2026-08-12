<!-- Read before starting: AGENT.md, context/architecture_context.md, context/ui_context.md -->

# 01 — Foundation

Initialize the Next.js 16 project with its core toolchain (TypeScript strict, ESLint, Tailwind, shadcn/ui, next-intl as a dependency) and map the design tokens from `ui_context.md` into the styling layer, giving every later feature unit a working, lint-clean, buildable base to start from.

---

## Architecture, rules and constraints

- Next.js 16.3.0 — App Router, Turbopack, SSG (no server runtime features needed at this stage).
- React 19.2.8, TypeScript ~5.9.x (strict mode), Tailwind CSS 4.1.x. **Deviation from original spec:** `architecture_context.md` specified TypeScript 7.0.2, but `typescript-eslint` (pulled in by `eslint-config-next`) does not yet support TS 7.0 and crashes on lint — confirmed during implementation, tracked at https://github.com/typescript-eslint/typescript-eslint/issues/10940. Downgraded to latest TS 5.x per user decision; revisit once typescript-eslint ships TS7 support.
- shadcn/ui via CLI, **Base UI** primitives (confirmed — shadcn's default since July 2026, do not use Radix). Pass the primitives flag explicitly rather than relying on the default — verify exact flag name via CLI `--help`.
- next-intl 4.13.5 — installed as a dependency only in this unit. Routing, `proxy.ts`, and message files are out of scope (unit 02).
- No `src/` directory — top-level folders per `architecture_context.md`: `app/`, `components/` (incl. `components/ui/` for shadcn), `lib/`, `types/`, `content/`, `messages/`. Pass the CLI flag to disable `src/` explicitly — verify exact flag name via `create-next-app --help` / versioned docs, do not assume it from memory.
- Server Components by default; no `'use client'` needed in this unit (no interactive components yet).
- No backend, no DB/ORM, no Zod/Resend/Stripe — static site only.
- Package manager: npm (per `workflow.md`, verification step runs `npm run build`).
- Next.js 16, next-intl 4.x and shadcn/ui are newer than standard training knowledge — check `node_modules/next/dist/docs/` and official shadcn docs (dated August 2026) during setup rather than relying on memorized CLI flags/output.

## Design

Design tokens only — no components or layout in this unit. Map `ui_context.md` into Tailwind:

- Colors as CSS variables (Tailwind 4 `@theme` in `globals.css`, or equivalent per current Tailwind 4.1 docs). Text-color tokens are renamed from `ui_context.md`'s naming to avoid doubled `text-text-*` utility classes (confirmed with user):
  - `--color-accent-blue: oklch(0.7331 0.1414 253.23)`
  - `--color-accent-red: oklch(0.6578 0.2483 20.82)`
  - `--color-accent-yellow: oklch(0.9111 0.1595 96)`
  - `--color-accent-green: oklch(0.8637 0.2582 161.65)`
  - `--color-heading: oklch(0 0 0)` (was `--color-text-heading` in ui_context.md → utility class `text-heading`)
  - `--color-subheading: oklch(0.4892 0.0051 17.33)` (was `--color-text-subheading` → `text-subheading`)
  - `--color-body: oklch(0.4892 0.0051 17.33)` (was `--color-text-body` → `text-body`)
  - `--color-on-accent: oklch(1 0 0)` (was `--color-text-on-accent` → `text-on-accent`)
- Font: Google Sans Flex, variable font, loaded via `next/font/google`, wired as the default sans font in the Tailwind theme.
- Radius: set `--radius: 9999px` (not a percentage — a percentage radius on non-square elements clips to an ellipse, not a pill). A radius value larger than half the element's height clips to a perfect pill on any button/badge/nav/card regardless of size — this is the only correct way to achieve the "pill-style everywhere" requirement from `ui_context.md`.
- No dark mode tokens (out of scope for MVP per `ui_context.md`).
- Accent colors are decorative/alternated only — do not wire any semantic meaning (state, category) to them at the token level.

---

## Implementation

1. Check the installed `create-next-app` CLI's exact flag for disabling `src/` (run `--help` or check `node_modules/next/dist/docs/` — flag names may differ in 16.3, do not assume the flag from memory). Scaffold the Next.js project at the repo root with that flag passed explicitly (no `src/` dir), plus TypeScript, App Router, Tailwind CSS, ESLint, and Turbopack enabled, targeting the versions in Architecture above.

2. Enable TypeScript strict mode in `tsconfig.json` (`"strict": true`), confirm no additional relaxations are present.

3. Confirm ESLint is configured with the Next.js default ruleset (from scaffold); no custom rules for this unit.

4. Check the installed shadcn CLI's exact flag for selecting the Base UI primitives library (run `--help`, name may not be `-b base` — verify, do not assume) and pass it explicitly during `shadcn init`, rather than relying on Base UI being the current default. Confirmed flag: `-b, --base <base>` with value `base` (`npx shadcn@latest init -b base -t next -p nova -y`). **Note:** `components.json` does not have a separate `"base"` key — the CLI encodes it into `"style": "base-nova"`; the authoritative check is `@base-ui/react` present in `package.json` dependencies (not `@radix-ui/*`).

5. Install `next-intl` as a dependency. Do not configure routing, middleware/proxy, or message files here.

6. Add the design tokens (colors, font, radius) from the Design section into `app/globals.css`. Reconcile with what `shadcn init` already wrote there rather than appending a disconnected block:
   - Override shadcn's own `--radius` variable in place with `9999px` — do not introduce a second radius variable.
   - Keep shadcn's semantic tokens (`--background`, `--foreground`, `--primary`, `--card`, etc., used for component internals) and our decorative/content tokens (`--color-accent-*`, `--color-heading`, `--color-subheading`, `--color-body`, `--color-on-accent`) as two clearly separate, labeled groups for now — do not merge or remap them in this unit.
   - Wire the Google Sans Flex font via `next/font/google` in `app/layout.tsx`.
   - Log an open question in `progress_tracker.md` (non-blocking) for unit 04+: whether `--primary` and other shadcn semantic tokens should later be re-mapped to one of the accent colors, or stay as shadcn defaults for component chrome only.
   - Update `context/ui_context.md`: replace `--color-text-heading` / `--color-text-subheading` / `--color-text-body` / `--color-text-on-accent` with `--color-heading` / `--color-subheading` / `--color-body` / `--color-on-accent` in the Colori table, and add a one-line note below it: "Naming aggiornato in unit 01 per evitare classi Tailwind doppie (text-text-heading → text-heading)."

7. Create the empty base folders with a `.gitkeep` (or equivalent) where Next.js/git won't otherwise track them: `components/`, `lib/`, `types/`, `content/`. Do not add any files with logic or content inside them yet.

8. Leave the default scaffolded `app/page.tsx` as a minimal placeholder (e.g. confirms the app renders) — no real homepage content yet, that starts at unit 04+.

---

## Dependencies

Install: `next-intl`

(shadcn/ui CLI and Base UI packages are installed by the shadcn init step itself, per whatever the CLI resolves.)

---

## Scope Limits

- No i18n routing, `proxy.ts`, or locale redirect logic — that's unit 02.
- No `messages/en.json` / `messages/it.json` or any translation content — unit 02.
- No content types, `lib/content.ts`, or real experience/education/project data — unit 03.
- No Nav, Hero, or any homepage section markup — unit 04+.
- No shadcn components beyond what `shadcn init` itself creates (no `button`, `card`, etc. added yet) — pull in individual components only when the unit that needs them arrives.
- No dark mode setup.
- Keep this focused on: project scaffold, toolchain config, and design tokens only.

---

## Check When Done

- `package.json` lists Next.js 16.3.0, React 19.2.8, TypeScript ~5.9.x (see deviation note above — not 7.0.2), Tailwind 4.1.x, `next-intl` 4.13.5.
- `tsconfig.json` has `"strict": true`.
- `package.json` dependencies include `@base-ui/react` (not `@radix-ui/*`); `components.json` shows `"style": "base-nova"`.
- No `src/` directory exists at the repo root; `app/`, `components/`, `lib/`, `types/`, `content/` are all top-level.
- `app/globals.css` defines the 8 color tokens (4 accent + `--color-heading`/`--color-subheading`/`--color-body`/`--color-on-accent`), clearly separated from shadcn's own semantic tokens; the Google Sans Flex font is applied via `next/font/google`; `--radius` is set to `9999px` (shadcn's existing variable overridden in place, not a new one) and renders as a true pill on rectangular elements (e.g. a wide button), not an ellipse.
- `progress_tracker.md` logs the open question about remapping `--primary`/shadcn semantic tokens to accent colors, flagged for unit 04+.
- `context/ui_context.md` color token names match what's actually implemented in `globals.css` (no `--color-text-*` naming left in the doc).
- `components/`, `lib/`, `types/`, `content/` exist and are empty (tracked, no logic/content).
- `npx eslint .` runs with no errors.
- `npm run build` passes.
