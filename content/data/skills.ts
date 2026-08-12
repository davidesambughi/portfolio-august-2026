/** A tech-stack logo shown in the Technologies grid. iconSlug maps to a simple-icons export. */
export type Technology = { id: string; label: string; iconSlug: string };

/** A methodology/approach pill — text only, no icon. */
export type Methodology = { label: { en: string; it: string } };

/** A certificate shown as a small logo/thumbnail + label, like the Technologies icons — image is a cropped screenshot of the real PDF certificate, not a brand logo, so it's a static path rather than a simple-icons slug. Optional pdfUrl links to the original PDF, shown as a lightbox action (same pattern as Education's entries). */
export type Certificate = { id: string; label: string; imageSrc: string; pdfUrl?: string };

/** Display order matters — renders row-major in the Technologies grid, as-is, no sorting. */
export const technologies: Technology[] = [
  { id: "typescript", label: "TypeScript", iconSlug: "typescript" },
  { id: "javascript", label: "JavaScript", iconSlug: "javascript" },
  { id: "python", label: "Python", iconSlug: "python" },
  { id: "nextjs", label: "Next.js", iconSlug: "nextdotjs" },
  { id: "react", label: "React", iconSlug: "react" },
  { id: "nodejs", label: "Node.js", iconSlug: "nodedotjs" },
  { id: "postgresql", label: "PostgreSQL", iconSlug: "postgresql" },
  { id: "mysql", label: "MySQL", iconSlug: "mysql" },
  { id: "mongodb", label: "MongoDB", iconSlug: "mongodb" },
  { id: "supabase", label: "Supabase", iconSlug: "supabase" },
  { id: "figma", label: "Figma", iconSlug: "figma" },
  { id: "git", label: "Git", iconSlug: "git" },
  { id: "docker", label: "Docker", iconSlug: "docker" },
  { id: "vercel", label: "Vercel", iconSlug: "vercel" },
];

export const methodologies: Methodology[] = [
  { label: { en: "Specification-Driven Development", it: "Specification-Driven Development" } },
  { label: { en: "Agile / SDLC", it: "Agile / SDLC" } },
  { label: { en: "AI-assisted Engineering", it: "Ingegneria assistita da IA" } },
  { label: { en: "OOP", it: "OOP" } },
];

export const certificates: Certificate[] = [
  {
    id: "claude-code-in-action",
    label: "Claude Code in Action",
    imageSrc: "/images/certificate-claude-code.png",
    pdfUrl: "/images/certificate-7fe9r29gj9qe-1772877055.pdf",
  },
  {
    id: "uml-modeling",
    label: "Software Engineering: Modeling Software Systems using UML",
    imageSrc: "/images/certificate-coursera-uml.png",
    pdfUrl: "/images/Coursera YFPB6ZWRJVYD.pdf",
  },
];
