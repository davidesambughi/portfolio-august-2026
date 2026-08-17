import { z } from "zod";

/** Mirrors ProjectMeta (types/project.ts) minus `slug`, which is derived from the filename, not the frontmatter. */
export const projectFrontmatterSchema = z.object({
  title: z.string(),
  summary: z.string(),
  badgeLabel: z.string(),
  techStack: z.array(z.string()),
  subtitleTags: z.array(z.string()),
  coverImage: z.string(),
  githubUrl: z.string().optional(),
  liveUrl: z.string().optional(),
  accentColor: z.enum(["blue", "red", "yellow", "green"]),
});
