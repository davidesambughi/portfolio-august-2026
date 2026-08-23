## This file has to be written precisely, clearly , and concisely. Do not add , assume or invent, but ask for more information if you need it .

# 15 — Knowledge Assistant Project Card

<!-- Read before starting: AGENTS.md, context/project_overview.md, context/ui_context.md,
     context/architecture_context.md, types/project.ts, lib/content.ts,
     components/projects-section.tsx, content/projects/en/raising-kids-in-portugal.mdx,
     content/projects/it/raising-kids-in-portugal.mdx -->

Add a new project ("Knowledge Assistant") to the homepage Projects section as a card that links straight out to its live site (and, unlike the existing `liveUrl` precedent, also exposes a GitHub link), reusing the exact `liveUrl` MVP pattern already built and shipped for `raising-kids-in-portugal` — no new code, only new content.

---

## Architecture, rules and constraints

- The Projects grid (`components/projects-section.tsx`) and `ProjectMeta` (`types/project.ts`) already fully support this case — confirmed by reading both files. No component/type changes are needed.
- `ProjectMeta.liveUrl` (optional): when set, `ProjectCard` renders the whole card as `<a href={liveUrl} target="_blank" rel="noopener noreferrer">` instead of `<Link href="/project/[slug]">` — this is the exact mechanism to use here (see `raising-kids-in-portugal.mdx`, the only other project currently using it).
- `ProjectMeta.githubUrl` (optional) exists on the type but is only ever rendered on the internal project **detail page** (unit 09b), never on the homepage card. Since this project has no detail page (per user decision — see Scope Limits), setting `githubUrl` in the frontmatter has **no visible effect anywhere** right now. It will be set anyway (for forward-compatibility if a detail page is built later) but this is flagged as a known no-op, not invented behavior.
- `getProjects(locale)` (`lib/content.ts`) reads every `.mdx` file under `content/projects/{locale}/` — adding new files is enough, no registration step elsewhere.
- `09j`'s Zod validation + en/it slug-parity check (`lib/content.ts`) will run against this new project automatically — both locale files must exist with matching frontmatter shapes or the build fails.
- Grid math (`components/projects-section.tsx`, `GRID_SIZE = 3`, `fillerCount = Math.max(0, 3 - projects.length)`): projects count goes from 2 (`example-project`... actually current real count per `progress_tracker.md` is `remote-nix` + `raising-kids-in-portugal`) to 3 — filler "Coming soon" cards automatically drop from 1 to 0. No code change, just a consequence of adding a third real project.
- Per the mockup-fidelity rule (`ui_context.md`), the card's `summary` field renders as a single `<p>` with no line-clamp/truncation in the current markup — keep the summary short (comparable length to the other two project summaries), not the long two-paragraph text originally drafted by the user (already resolved: user supplied a shortened EN/IT summary in-conversation, see Implementation step 1).

---

## Design

No new UI — this unit only adds content files. Visual result: a third real project card appears in the existing 3-column grid, styled identically to `raising-kids-in-portugal`'s card (image box border/shadow, centered badge+title+summary+tech badges below, whole card opens the live site in a new tab on click).

`coverImage`: no screenshot asset provided yet — per user decision, use the existing `bg-muted` fallback background (same as `example-project`/other projects before their real screenshot existed). Point `coverImage` at a not-yet-existing path (`/images/projects/knowledge-assistant/cover.png`) so swapping in a real screenshot later is a drop-in file replacement, no code/content change.

---

## Implementation

1. Create `content/projects/en/knowledge-assistant.mdx` with frontmatter:
   - `title: "Knowledge Assistant"`
   - `summary: "Standalone RAG chatbot that answers only from ingested documents, using structural chunking, hybrid search on pgvector, and streaming generation."`
   - `badgeLabel: "Aug - 2026"`
   - `techStack: ["Next.js", "TypeScript", "Supabase", "Google Gemini API", "Vercel AI SDK", "Zod", "Upstash Redis", "shadcn/ui", "next-intl", "Vercel"]`
   - `subtitleTags`: same array as `techStack` (unused today — no detail page — but kept consistent with the type's expectation, same treatment as other `liveUrl` projects)
   - `coverImage: "/images/projects/knowledge-assistant/cover.png"` (file does not exist yet — renders on `bg-muted` fallback)
   - `accentColor: "red"`
   - `githubUrl: "https://github.com/davidesambughi/knowledge-assistant"`
   - `liveUrl: "https://kb.davidesambughi.dev/"`
   - Body: one-line placeholder note, same wording pattern as `raising-kids-in-portugal.mdx` ("Placeholder case-study content — this project currently links out to the live site instead of this detail page (see `liveUrl` in the frontmatter), so this body is not rendered anywhere yet.")

2. Create `content/projects/it/knowledge-assistant.mdx`, identical structure, IT-specific fields:
   - `title: "Knowledge Assistant"` (unchanged, proper noun)
   - `summary: "Chatbot RAG standalone che risponde solo dai documenti caricati, con chunking strutturale, hybrid search su pgvector e generazione in streaming."`
   - all other frontmatter fields identical to the EN file (badgeLabel, techStack, subtitleTags, coverImage, accentColor, githubUrl, liveUrl — same convention as `raising-kids-in-portugal`'s IT/EN files, which share every field except `title`/`summary`/body)
   - Body: IT placeholder note mirroring `raising-kids-in-portugal.mdx`'s IT body wording.

3. No changes to `types/project.ts`, `lib/content.ts`, `components/projects-section.tsx`, or any `messages/*.json` file.

---

## Dependencies

None — no new packages.

---

## Scope Limits

- No project detail page (`/project/knowledge-assistant`) — per explicit user decision this unit only adds a card that links externally, same MVP treatment as `raising-kids-in-portugal`. A future unit can add a real case-study page for this project; `githubUrl` is already set in the frontmatter for that day.
- No real `coverImage` screenshot — placeholder `bg-muted` fallback only, until a real screenshot file is provided.
- No changes to `ProjectMeta`, `getProjects`/`getProjectBySlug`, or `ProjectCard`/`ComingSoonCard` — the existing `liveUrl` mechanism is reused as-is.
- No i18n namespace changes (`messages/en.json`/`it.json`) — nothing new needed, all project content lives in the MDX frontmatter, not in `messages/*`.
- Do not touch `components/ui/*`.

---

## Check When Done

- `content/projects/en/knowledge-assistant.mdx` and `content/projects/it/knowledge-assistant.mdx` both exist with matching frontmatter shape (parity check from unit 09j passes).
- Homepage Projects grid (`/en#projects` and `/it#projects`) shows 3 real cards, 0 "Coming soon" filler cards.
- Knowledge Assistant card: clicking anywhere on the card opens `https://kb.davidesambughi.dev/` in a new tab (not an internal `/project/knowledge-assistant` route — that route should 404 or not exist, consistent with `raising-kids-in-portugal`'s current behavior since no detail page exists for it either).
- Badge shows "Aug - 2026", accent color is red, tech badges match the listed stack, summary text matches the shortened EN/IT versions above.
- `npm run build` passes (includes the 09j Zod/slug-parity validation).
