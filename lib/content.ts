import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { experience } from "@/content/data/experience";
import { education } from "@/content/data/education";
import { technologies, methodologies, certificates } from "@/content/data/skills";
import { contactLinks } from "@/content/data/contacts";
import { projectFrontmatterSchema } from "@/lib/project-schema";
import { routing } from "@/i18n/routing";
import type { Experience } from "@/types/experience";
import type { Education } from "@/types/education";
import type { Project, ProjectMeta } from "@/types/project";
import type { Technology, Methodology, Certificate } from "@/content/data/skills";
import type { ContactLink } from "@/content/data/contacts";

const PROJECTS_DIR = path.join(process.cwd(), "content", "projects");

/** Most-recent-first: ongoing entries (endDate: null) sort before dated ones. */
function byMostRecent(a: { startDate: string }, b: { startDate: string }) {
  return b.startDate.localeCompare(a.startDate);
}

function sortByEndDate<T extends { endDate: string | null; startDate: string }>(
  items: T[]
): T[] {
  return [...items].sort((a, b) => {
    if (a.endDate === null && b.endDate === null) return byMostRecent(a, b);
    if (a.endDate === null) return -1;
    if (b.endDate === null) return 1;
    return b.endDate.localeCompare(a.endDate) || byMostRecent(a, b);
  });
}

export function getExperience(): Experience[] {
  return sortByEndDate(experience);
}

export function getEducation(): Education[] {
  return sortByEndDate(education);
}

/** Declared order, no sorting — matches the mockup's fixed grid layout. */
export function getTechnologies(): Technology[] {
  return technologies;
}

/** Declared order, no sorting — matches the mockup's fixed pill order. */
export function getMethodologies(): Methodology[] {
  return methodologies;
}

/** Declared order, no sorting. */
export function getCertificates(): Certificate[] {
  return certificates;
}

/** Declared order, no sorting — LinkedIn, GitHub, Gmail. */
export function getContactLinks(): ContactLink[] {
  return contactLinks;
}

function slugsInLocale(locale: string): Set<string> {
  const dir = path.join(PROJECTS_DIR, locale);
  return new Set(
    fs
      .readdirSync(dir)
      .filter((file) => file.endsWith(".mdx"))
      .map((file) => file.replace(/\.mdx$/, ""))
  );
}

/**
 * Slugs are enumerated from the English folder, but every locale in `routing.locales`
 * must have a matching file — a slug present in one locale and missing in another
 * would otherwise 404 silently on the missing side (`getProjectBySlug` returns `null`).
 */
export function getProjectSlugs(): string[] {
  const byLocale = new Map(routing.locales.map((locale) => [locale, slugsInLocale(locale)]));
  const allSlugs = new Set(Array.from(byLocale.values()).flatMap((slugs) => [...slugs]));

  for (const slug of allSlugs) {
    const missingIn = routing.locales.filter((locale) => !byLocale.get(locale)!.has(slug));
    if (missingIn.length > 0) {
      throw new Error(
        `Project "${slug}" is missing its MDX file for locale(s): ${missingIn.join(", ")}. ` +
          `Every project must have a content/projects/{locale}/${slug}.mdx file for each of: ${routing.locales.join(", ")}.`
      );
    }
  }

  return [...byLocale.get(routing.defaultLocale)!];
}

function parseProjectFrontmatter(data: unknown, locale: string, slug: string): Omit<ProjectMeta, "slug"> {
  const result = projectFrontmatterSchema.safeParse(data);
  if (!result.success) {
    throw new Error(
      `Invalid frontmatter in content/projects/${locale}/${slug}.mdx: ${result.error.message}`
    );
  }
  return result.data;
}

export function getProjects(locale: string): ProjectMeta[] {
  return getProjectSlugs().map((slug) => {
    const filePath = path.join(PROJECTS_DIR, locale, `${slug}.mdx`);
    const { data } = matter(fs.readFileSync(filePath, "utf8"));
    return { ...parseProjectFrontmatter(data, locale, slug), slug };
  });
}

export function getProjectBySlug(locale: string, slug: string): Project | null {
  const filePath = path.join(PROJECTS_DIR, locale, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const { data, content } = matter(fs.readFileSync(filePath, "utf8"));
  return { ...parseProjectFrontmatter(data, locale, slug), slug, content };
}
