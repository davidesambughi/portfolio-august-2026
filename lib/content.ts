import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { experience } from "@/content/data/experience";
import { education } from "@/content/data/education";
import { technologies, methodologies, certificates } from "@/content/data/skills";
import { contactLinks } from "@/content/data/contacts";
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

/** Slugs are enumerated from the English folder; every locale must have a matching file. */
export function getProjectSlugs(): string[] {
  const enDir = path.join(PROJECTS_DIR, "en");
  return fs
    .readdirSync(enDir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export function getProjects(locale: string): ProjectMeta[] {
  return getProjectSlugs().map((slug) => {
    const filePath = path.join(PROJECTS_DIR, locale, `${slug}.mdx`);
    const { data } = matter(fs.readFileSync(filePath, "utf8"));
    return { ...(data as Omit<ProjectMeta, "slug">), slug };
  });
}

export function getProjectBySlug(locale: string, slug: string): Project | null {
  const filePath = path.join(PROJECTS_DIR, locale, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const { data, content } = matter(fs.readFileSync(filePath, "utf8"));
  return { ...(data as Omit<ProjectMeta, "slug">), slug, content };
}
