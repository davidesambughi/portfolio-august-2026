<!-- Read before starting: AGENT.md, context/architecture_context.md, context/ui_context.md, context/user_flows.md -->

# 04 — Nav & Hero

Build the section navigation (sticky, pill desktop / hamburger mobile) and the Hero section, and wire both into the homepage in place of the current Next.js boilerplate in `app/[locale]/page.tsx`.

---

## Architecture, rules and constraints

- Single nav component only, 6 items (Projects, Education, Experience, Tech Stack, About, Contacts). No separate/duplicate header component — confirmed with user: the two CTA pills visible near the top in `header-portofolio.png` are the Hero's own "Projects"/"Contacts" CTAs still on screen mid-scroll, not a second nav element.
- Nav starts in normal flow below the Hero, then sticks to the top of the viewport on scroll (`user_flows.md`: "resta visibile per un breve tratto di scroll, poi si aggancia in cima"). Implement with CSS `position: sticky; top: 0` — no scroll-listener/JS needed for the docking behavior itself.
- Mobile: pill nav collapses to a hamburger menu (`ui_context.md`, `user_flows.md` — adattamenti mobile table). Breakpoint: Tailwind default `md` (768px), per `ui_context.md` ("breakpoint Tailwind/shadcn default").
- Styling must follow `ui_context.md` exactly: pill radius everywhere (global `--radius: 9999px`, already set), Google Sans Flex, `--color-heading`/`--color-subheading`/`--color-body`/`--color-on-accent` tokens, accent colors used decoratively (not semantically), 200ms `transition-colors`/`transition-transform` on interactive elements, nav hover = light grey halo, buttons hover = same color slightly darker.
- Server Component by default for the Hero (static, no interactivity — use `getTranslations` from `next-intl/server`). The Nav needs client-side state only for the mobile menu open/closed toggle — implement the whole `Nav` as `'use client'` (small leaf component, per `architecture_context.md`: `'use client'` only where real interactivity is needed).
- Nav link targets are anchors (`#projects`, `#education`, `#experience`, `#tech-stack`, `#about`, `#contacts`) for sections that don't exist yet (units 05–06 build them). Links are wired now; the anchors themselves will simply not scroll anywhere until those sections exist — expected, not a bug.
- Do not modify `components/ui/button.tsx`. It wraps Base UI's `Button` primitive, which does **not** support `asChild` (and Base UI's docs explicitly warn against `render={<a />}` for links, since the primitive forces `role="button"` which overrides the `<a>`'s native link semantics). For the Hero CTAs, apply the exported `buttonVariants()` helper directly to a native `<a href="#...">` instead — verified against current shadcn docs.
- No new dependencies: build the mobile menu with a plain `useState` toggle and Tailwind, no new shadcn primitive install (keeps this unit dependency-free, consistent with `architecture_context.md`'s minimal-deps stance).

---

## Design

Based on `ui_context.md` plus the mid-fi mockups `public/images/hero-portfolio.png` and `public/images/header-portofolio.png`.

### Hero

- Two-column layout on desktop (`md:` and up): text block left, decorative screenshot collage right. Single column on mobile: text block first, collage below it, scaled down.
- Text block, top to bottom:
  1. Small badge: accent-green dot (`--color-accent-green`) + label text "AI-Native" (confirmed literal text, same in both locales).
  2. Heading block: name ("Davide Sambughi") and role ("Full Stack Developer") stacked on two lines, same bold weight/size, `--color-heading`. Implement as a single `<h1>` with a `<br />` between the two lines (this is the page's one and only `h1`). **Deliberate exception to the Titoli/Sottotitoli typography table in `ui_context.md`** (which would put the role in `--color-subheading`, grey): the mockup shows name+role as one visual block, both black — confirmed with user to follow the mockup here rather than the general rule.
  3. Body paragraph, `--color-body`, regular weight. Real copy not available yet — use a short placeholder sentence (not lorem ipsum gibberish, an actual plausible placeholder sentence in each locale). Logged as a non-blocking open question in `progress_tracker.md` — replace with real copy later (no unit currently owns this; flag when copy is provided).
  4. Two CTA pills: "Projects" (filled, accent-blue background, `--color-on-accent` text) and "Contacts" (outline, accent-blue border/text). Both are anchor links (`#projects`, `#contacts`), reuse `components/ui/button.tsx`.
- Screenshot collage (right side, decorative only — no real project data, content layer's placeholder project has no image asset yet per unit 03): three overlapping rounded rectangles matching the mockup's relative sizes/positions — one large light-grey block, one small teal block bottom-left overlapping it, one medium pink/red block bottom-right overlapping it. Plain `<div>`s with rounded corners and flat background colors: grey block = neutral grey (not a design token), teal block = `--color-accent-green` (closest of the 4 available accent tokens to the mockup's teal — same green-family hue, whereas blue/red/yellow are further off on the color wheel), pink block = `--color-accent-red`. No image files, no "SCREENSHOT N" labels rendered (those are mockup annotations, not real content).
- The small "Shirley Franklin" tag visible in the mockup near the teal block is a leftover Figma artifact (collaborator/comment marker), not part of the design — excluded entirely.
- Hero is not full-viewport-height; height is intrinsic to its content (compact homepage per `project_overview.md`).

### Nav

- Desktop: horizontal pill, one continuous rounded container (`--radius: 9999px`), 6 text links evenly spaced, `--color-body` default, hover = light grey halo per `ui_context.md`.
- Mobile (`< md`): pill container shows only a hamburger icon button, right-aligned. Tapping toggles an expanded panel directly below the pill (not a full-screen overlay) listing the 6 links vertically, same rounded/pill visual language, closes on link click or second tap. Chosen as a non-modal disclosure (in-flow expand/collapse) rather than a modal/full-screen overlay: no focus-trap, scroll-lock, or dialog primitive required, no mockup dictated an overlay, and it keeps this unit dependency-free (no new shadcn `Dialog`/`Sheet` install).
- Sticky: `position: sticky; top: 0`, background white (`bg-background` or equivalent), `z-index` above page content, subtle shadow so it reads as "docked" once stuck at the top (always-on shadow is acceptable — no JS-based stuck-state detection in this unit).
- No active-link scroll-spy highlighting in this unit — out of scope (see Scope Limits).

---

## Implementation

1. Add `nav` and `hero` keys to `messages/en.json` and `messages/it.json`:
   - `nav`: `projects`, `education`, `experience`, `techStack`, `about`, `contacts`, `menuToggle` (aria-label for the hamburger button).
   - `hero`: `badge`, `name`, `role`, `body`, `ctaProjects`, `ctaContacts`.
   - EN nav labels: "Projects", "Education", "Experience", "Skills", "About", "Contacts". IT: "Progetti", "Formazione", "Esperienza", "Skills", "Chi sono", "Contatti". (Rinominato da "Tech Stack"/"Competenze" a "Skills" post-unit 04, invariato in entrambe le lingue — vedi `architecture_context.md`.)
   - `badge` = "AI-Native" in both locales. `name` = "Davide Sambughi" (both). `role` = "Full Stack Developer" (EN) / "Full Stack Developer" (IT — role title kept in English, per CV). `body` = short placeholder sentence, distinct wording per locale. `ctaProjects`/`ctaContacts` = "Projects"/"Contacts" (EN), "Progetti"/"Contatti" (IT).

2. Create `components/nav.tsx` (`'use client'`):
   - Reads `nav.*` via `useTranslations("nav")`.
   - Renders the sticky pill container described in Design.
   - `useState` for mobile menu open/closed; hamburger button toggles it, `aria-expanded`/`aria-controls` wired for accessibility.
   - 6 anchor links (`<a href="#projects">`, etc.) reused identically in both desktop and mobile layouts.

3. Create `components/hero.tsx` (Server Component, `async`, uses `getTranslations("hero")` from `next-intl/server`):
   - Renders badge, `h1` (name + role), body paragraph, two CTA links (native `<a href="#...">` styled with `buttonVariants()` from `components/ui/button.tsx` — no `asChild`, per Architecture notes), and the decorative screenshot collage `div`s.

4. Replace the contents of `app/[locale]/page.tsx`: remove the Next.js boilerplate (logo, "get started" text, Deploy/Documentation links), render `<Nav />` then `<Hero />`.

5. Update `app/[locale]/layout.tsx` `metadata` (currently still "Create Next App" boilerplate from unit 01) to a real `title`/`description` for the site, sourced as plain strings for now (no dedicated SEO unit until 10 — keep minimal, just replace the placeholder values).

---

## Scope Limits

- No Projects/Education/Experience/Tech Stack/About/Contacts sections — units 05 and 06. Nav links point to anchors that don't resolve to anything yet.
- No scroll-spy / active-link highlighting on the nav.
- No real project screenshots in the Hero collage — decorative placeholder blocks only, per Design section.
- No final hero body copy — placeholder text, logged as open question in `progress_tracker.md`.
- No language switcher UI — not part of this unit's scope (not mentioned in the feature list for unit 04; revisit if missing later).
- No dark mode (out of MVP scope per `ui_context.md`).
- Keep this focused on: the Nav component, the Hero component, and wiring both into `app/[locale]/page.tsx`.

---

## Check When Done

- `components/nav.tsx` and `components/hero.tsx` exist and render without errors in both `/en` and `/it`.
- Nav shows the 6-item pill on desktop widths, hamburger toggle on mobile widths (`< md`); toggle opens/closes the mobile panel.
- Nav is positioned in normal flow below the Hero and visibly docks to the top of the viewport when scrolled.
- Hero renders badge, name, role, body placeholder, and both CTA pills, all sourced from `messages/{locale}.json` (no hardcoded UI strings in the components).
- Hero collage renders three decorative overlapping blocks, no image assets referenced.
- `app/[locale]/page.tsx` no longer contains any of the original Next.js boilerplate.
- `progress_tracker.md` updated with the open question about final hero copy.
- `npm run build` passes.
