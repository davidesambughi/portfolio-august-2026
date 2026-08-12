## This file has to be written precisely, clearly , and concisely. Do not add , assume or invent, but ask for more information if you need it .

# 8d — Expand Affordance Chevron (Education & Experience)

<!-- Read before starting: AGENTS.md, ui_context.md, architecture_context.md, progress_tracker.md (8c entry), 8c-homepage-mobile-accordion.md (source pattern being reused). -->

Add the same chevron icon already used by the homepage mobile accordion (8c) to every expandable row in Education and Experience, so users understand those rows are clickable — hover alone doesn't communicate this on touch devices (no hover state on mobile).

---

## Architecture, rules and constraints

**Why now**: user reported that Education's list items and Experience's timeline nodes look expandable/selectable but have no visual cue beyond a hover state — insufficient on mobile, where hover doesn't exist. Confirmed with the user (2026-08-12): reuse the exact chevron pattern already shipped in 8c (`components/accordion-section-heading.tsx`) rather than invent a new indicator, for one consistent "this is expandable" visual language site-wide.

**Reused pattern, not new**: `lucide-react`'s `ChevronDown`, rotating 180° on expand via `group-data-*`/state-driven class, 200ms transition (`ui_context.md`'s standard interaction timing) — same icon, same rotation behavior, same duration as 8c. No new dependency, no new token.

**Visible always, both breakpoints** (user decision, differs from 8c): 8c's chevron is mobile-only (`lg:hidden`) because desktop keeps a completely different, always-expanded layout with no trigger at all. Education and Experience are different: both already have real click-to-expand/select interactivity on desktop too (Education's selector, Experience's expand-on-click), and hover alone is judged insufficient there as well — so the chevron renders at every breakpoint, additive to the existing hover state, not a replacement for it.

**Applies to every expandable row**, not just the active/selected/expanded one (user decision) — consistent with 8c, where every trigger shows its own chevron regardless of state, so it's clear from first glance which rows are interactive.

**Per-component semantics differ, rotation logic must match each component's actual state model**:
- **Education** (`components/education-list.tsx`): single-select, not independent toggles — clicking a list item selects it (deselecting whatever was selected before). The chevron rotates 180° only on the currently `isSelected` entry; every other entry's chevron stays in its default (pointing down) orientation. This is not a "closed" vs "open" state on the unselected entries — they're simply not selected, same as today.
- **Experience** (`components/experience-timeline.tsx`): independent per-node toggle (`expandedIds: Set<string>`), already multi-open like 8c. The chevron rotates 180° per node based on that node's own `isExpanded`, exactly mirroring 8c's per-trigger logic. Applies to both the desktop timeline and the mobile stack — **not** to the decorative "Future" node, which has never been clickable and stays exactly as-is (no button, no chevron).

**No change to click targets, selection logic, or expand/collapse behavior itself** — this unit only adds a visual indicator to markup that already exists and is already clickable. `expandedIds`/`selectedId` state management is untouched.

---

## Design

- Icon: `ChevronDown` from `lucide-react`, `text-body` color (matches 8c and the rest of the site's secondary-icon color), `size-4` (smaller than 8c's `size-5` — these rows are tighter/denser than a full section heading row) — adjust after a visual check if it reads too small or too large next to the existing text sizes.
- Rotation: `rotate-180` when active/expanded, `transition-transform duration-200` (site standard), identical mechanism to 8c (`group` on the clickable element, `group-data-*` or a conditional class on the icon based on the existing `isSelected`/`isExpanded` boolean already in scope — no new Base UI primitive needed here since these aren't `Accordion.Trigger` elements, a plain conditional Tailwind class keyed off the existing boolean is sufficient and consistent with how `dotColorClass`/`hoverBgClass` are already applied conditionally in these files).
- Placement — real judgment call, no mockup for this (same category as Experience's original connector geometry in unit 07, flagged there as an implementation decision): the chevron sits inline, trailing the row's title text on the same line, not pinned to the row's far-right edge — because unlike 8c's full-width section heading, Education's list rows and Experience's timeline labels are not full-width rows (Experience especially: alternating narrow label blocks, not a wide bar). Placing it directly after the title text keeps it visually attached to the specific clickable element instead of floating disconnected at a row edge that may be much wider than the label itself.
  - Education: chevron after the `institution — degree` title text, same line, right end of that text (not the whole `<li>` width).
  - Experience desktop: chevron after `node.title`, same line as the bold title (not the subtitle/date lines below).
  - Experience mobile: same placement as desktop — after `node.title`, same line.
- No layout shift: reserve the icon's space so text doesn't reflow when a neighboring row's chevron rotates (rotation is transform-only, not a layout change, so this should be automatic — verify visually).

---

## Implementation

1. In `components/education-list.tsx`: import `ChevronDown` from `lucide-react`. In the list item `<button>`, wrap the title `<span>` and a new `ChevronDown` icon in a flex row (`flex items-center gap-2` or similar, only where needed to keep them inline) so the icon trails the title text. Icon gets `rotate-180` applied conditionally when `isSelected` is true, `transition-transform duration-200` always, `text-body` color, `size-4`, `shrink-0`, `aria-hidden="true"`.

2. In `components/experience-timeline.tsx`: import `ChevronDown` from `lucide-react`. In both the desktop `text` block and the mobile `text` block (two separate JSX blocks, same shape), add the chevron trailing `node.title` on its `<span>` line — but only when `!node.isFuture` (the Future node has no button, no interactivity, no chevron). Rotation driven by the existing `isExpanded` boolean already computed in both render sites (`expandedIds.has(node.id)`), same conditional-class approach as Education, same size/color/transition.

3. Visual check in the browser (desktop `lg`+ and a mobile-width view, both `/en` and `/it`, both sections): every clickable Education entry and every real Experience node (not "Future") shows a chevron next to its title at all times; the chevron rotates 180° when that entry becomes selected/expanded and rotates back when deselected/collapsed; no text wrapping/layout shift introduced; "Future" node unaffected (no chevron, unchanged).

---

## Dependencies

No new dependency — `ChevronDown` is already imported from the already-installed `lucide-react` elsewhere in the codebase (`components/accordion-section-heading.tsx`).

---

## Scope Limits

- Does not touch 8c's accordion chevron itself (`accordion-section-heading.tsx`) — that one is already correct and unchanged, this unit only extends the same visual language to two more components.
- Does not change Education's single-select behavior or Experience's independent multi-expand behavior — indicator only, no interaction-model changes.
- Does not add a chevron to the "Future" node in Experience — it has never been clickable.
- Does not touch Skills, About, Projects, Contacts, or the Project Detail Page TOC — not in scope, no expand/collapse affordance needed there.
- No new i18n keys — the icon is decorative (`aria-hidden`), the existing `aria-pressed`/`aria-expanded` attributes on the buttons already communicate state to assistive tech.

---

## Check When Done

- Every Education list entry shows a `ChevronDown` next to its title at all breakpoints; only the selected entry's chevron is rotated 180°.
- Every real (non-"Future") Experience node, desktop and mobile, shows a `ChevronDown` next to its title at all breakpoints; only expanded nodes' chevrons are rotated 180°, independently per node.
- "Future" node in Experience has no chevron, unchanged from before this unit.
- No visual regression: no unwanted text wrapping, no layout shift, hover states still work exactly as before.
- `npm run build` passes.
