/** Decorative accent, maps to the --color-accent-* tokens in ui_context.md — no semantic meaning. */
export type AccentColor = "blue" | "red" | "yellow" | "green";

/** Frontmatter shape for a single project's per-locale MDX file. */
export type ProjectMeta = {
  slug: string;
  title: string;
  summary: string;
  /** Free-text badge shown on the homepage card (e.g. "Jan - 2026") — not translated, same string in every locale. */
  badgeLabel: string;
  techStack: string[];
  /** Full tech + methodology line shown under the title on the detail page (unit 09b) — separate from techStack, which stays tech-only for homepage badges. */
  subtitleTags: string[];
  coverImage: string;
  /** CSS `aspect-ratio` value (e.g. "1920 / 998") for the homepage card's image box, matching
   * the source file's real dimensions so `object-cover` shows it uncropped — same technique as
   * Hero's collage (unit 04). Defaults to 16 / 10 when absent. */
  coverAspect?: string;
  githubUrl?: string;
  /** When set, the homepage card links straight here (external, new tab) instead of to the internal `/project/[slug]` detail page — MVP treatment for projects without a case-study page yet. */
  liveUrl?: string;
  accentColor: AccentColor;
};

/** Full project: metadata plus the raw MDX body (rendered in unit 07). */
export type Project = ProjectMeta & {
  content: string;
};
