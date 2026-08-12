# 02 — i18n Routing & Proxy

Wire next-intl's locale-based routing so every route lives under `/en/...` or `/it/...`, with automatic redirect to the default locale when the prefix is missing or invalid.

---

## Architecture, rules and constraints

- `next-intl` 4.13.5 is already installed (unit 01) but unconfigured — this unit adds routing config, `proxy.ts`, navigation helpers, and request config on top of it.
- Next.js 16.3: the middleware file is named `proxy.ts` (not `middleware.ts`), same `createMiddleware` API from `next-intl/middleware`. Confirmed via official docs (next-intl.dev, checked August 2026) and `architecture_context.md`.
- Locales: `en`, `it`. **Default locale: `en`** (confirmed with user — recruiter-facing site, EN as base).
- `localePrefix: 'always'` — both locales are explicitly prefixed (`/en/...`, `/it/...`), no bare unprefixed route for the default locale. This matches `user_flows.md` Flow 3, which shows prefixed URLs for both languages and a middleware redirect for missing/invalid prefixes.
- Locale negotiation beyond the default redirect (cookie, `Accept-Language`) is left to next-intl's own defaults — not specified in any context file, so no custom override here.
- No `src/` directory (per unit 01) — all new i18n files live at the project root or under top-level `app/`:
  - `i18n/routing.ts`, `i18n/navigation.ts`, `i18n/request.ts`
  - `proxy.ts` at repo root
  - `next.config.ts` updated to wrap with `next-intl`'s plugin
- Static site, SSG only (no server runtime features) — `app/[locale]/layout.tsx` must export `generateStaticParams()` over the two locales so both are prerendered.
- The existing `app/layout.tsx` and `app/page.tsx` placeholders from unit 01 move under `app/[locale]/`.
- Before writing `i18n/request.ts`, check the actually installed `next-intl` 4.13.5 types/API (`node_modules/next-intl`) rather than copying online examples verbatim — some current official examples reference an experimental `next/root-params` fallback pattern that may not apply to a plain `[locale]` dynamic segment setup. Use the plain `getRequestConfig(async ({locale}) => ...)` pattern unless the installed types require otherwise.
- `messages/en.json` and `messages/it.json` get only an empty/base structure in this unit — no real UI strings yet. Actual copy (nav labels, section headings, etc.) is added by the unit that introduces each piece of UI (04+).

---

## Implementation

1. Create `i18n/routing.ts`: `defineRouting({ locales: ['en', 'it'], defaultLocale: 'en' })`, with `localePrefix: 'always'` set explicitly (don't rely on the library default even if it matches, so the decision is visible in code).

2. Create `i18n/navigation.ts`: `createNavigation(routing)`, exporting `Link`, `redirect`, `usePathname`, `useRouter`, `getPathname`. No usage yet — later units import from here instead of `next/navigation` / `next/link` directly.

3. Create `i18n/request.ts`: `getRequestConfig` returning `{ locale, messages }`, loading `messages/${locale}.json`. Guard against an invalid locale param with `hasLocale` from `next-intl` and call `notFound()` if it fails.

4. Create `proxy.ts` at the repo root:
   - `createMiddleware(routing)` as the default export.
   - `matcher` excluding `/api`, `/_next`, `/_vercel`, and any path containing a dot (static files).

5. Update `next.config.ts`: wrap the existing config with `createNextIntlPlugin()` from `next-intl/plugin`.

6. Restructure `app/`:
   - Move `app/layout.tsx` and `app/page.tsx` into `app/[locale]/`.
   - `app/[locale]/layout.tsx`: add `generateStaticParams()` returning `routing.locales.map(locale => ({ locale }))`; set `<html lang={locale}>`; wrap `children` in `NextIntlClientProvider` fed by `getMessages()`.
   - Keep `app/page.tsx` and `app/layout.tsx` content otherwise unchanged from the unit 01 placeholder — no real homepage markup yet.

7. Create `messages/en.json` and `messages/it.json` with an empty object (`{}`) or the smallest placeholder structure needed to make step 3 type-check — no real translation keys.

8. Manually verify locale redirect behavior end-to-end (dev server): `/` → redirects to `/en`; `/it` loads directly; `/fr` (invalid locale) → redirects to `/en`.

---

## Scope Limits

- No real message keys/UI copy — added incrementally by each unit that introduces the corresponding UI (Nav/Hero in 04, etc.).
- No language switcher component — that's part of the Nav in unit 04.
- No homepage content beyond the existing unit 01 placeholder.
- No `not-found.tsx` / 404 handling — unit 08.
- No content layer, MDX, or project data — unit 03.
- Keep this focused on: routing config, proxy, navigation helpers, request config, and locale-based `app/` restructuring only.

---

## Check When Done

- `i18n/routing.ts`, `i18n/navigation.ts`, `i18n/request.ts`, and `proxy.ts` exist and match the Architecture section above.
- `next.config.ts` is wrapped with `createNextIntlPlugin()`.
- `app/[locale]/layout.tsx` and `app/[locale]/page.tsx` exist; no leftover `app/layout.tsx` / `app/page.tsx` outside `[locale]` unless the installed Next.js version requires a root-level layout (verify, don't assume).
- `app/[locale]/layout.tsx` exports `generateStaticParams()` covering both `en` and `it`.
- Visiting `/` redirects to `/en`; visiting `/it` renders directly; visiting an invalid locale (e.g. `/fr`) redirects to `/en`.
- `messages/en.json` and `messages/it.json` exist and are valid JSON.
- `npm run build` passes.
