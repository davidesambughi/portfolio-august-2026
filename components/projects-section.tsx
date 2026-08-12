import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { getProjects } from "@/lib/content";
import type { AccentColor, ProjectMeta } from "@/types/project";

// Literal class strings per accent color — Tailwind's JIT scanner only picks up classes it can
// see as-written in source, a template-interpolated `bg-accent-${color}` would get purged from
// the production build.
const ACCENT_BADGE_CLASSES: Record<AccentColor, string> = {
  blue: "bg-accent-blue text-on-accent",
  red: "bg-accent-red text-on-accent",
  yellow: "bg-accent-yellow text-on-accent",
  green: "bg-accent-green text-on-accent",
};

const GRID_SIZE = 3;

export async function ProjectsSection() {
  const t = await getTranslations("projects");
  const locale = await getLocale();
  const projects = getProjects(locale);
  const fillerCount = Math.max(0, GRID_SIZE - projects.length);

  return (
    // Full-bleed background test (2026-08-12, matching Footer's bg-black/[0.03]) — outer <section>
    // carries the edge-to-edge bg, inner div keeps the usual max-w-[1800px] content container.
    // Same two-layer structure as footer.tsx.
    <section id="projects" className="w-full bg-black/[0.03]">
      <div className="mx-auto w-full max-w-[1800px] px-[clamp(1.5rem,4vw,6rem)] pt-[clamp(3rem,8vh,6rem)] pb-[clamp(1.5rem,4vh,3rem)]">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-[clamp(1.5rem,1rem+2vw,2.5rem)] font-bold text-heading">
            {t("heading")}
          </h2>
          <p className="mt-3 text-[clamp(0.95rem,0.4vw+0.85rem,1.125rem)] text-body">
            {t("subheading")}
          </p>
        </div>

        <div className="mt-[clamp(2rem,5vh,3.5rem)] grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
          {Array.from({ length: fillerCount }).map((_, index) => (
            <ComingSoonCard key={index} label={t("comingSoon")} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: ProjectMeta }) {
  const cardBody = (
    // Per the mockup (public/images/project-portfolio.png): the border/frame belongs only to
    // the image box. Badge, title, description sit in free space below it — no card frame, no
    // card background — and are horizontally centered, not left-aligned. Card's own
    // rounded/ring/bg are cancelled here (twMerge resolves the conflicting utility groups).
    <Card className="h-full items-center gap-4 overflow-visible rounded-none border-0 bg-transparent p-0 text-center ring-0">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[28px] border border-black/10 bg-muted">
        <Image
          src={project.coverImage}
          alt={project.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      {/* grid-cols-1 explicit: without it, CardHeader's implicit single column shrinks to
          content width instead of filling the row (it only stretches when a card-action
          column is present), so it sat off-center to the left and squeezed the title into
          wrapping. An explicit 1fr column always fills the available width. */}
      <CardHeader className="grid-cols-1 items-center justify-items-center px-5">
        <Badge className={ACCENT_BADGE_CLASSES[project.accentColor]}>
          {project.badgeLabel}
        </Badge>
        <CardTitle className="text-lg font-bold whitespace-nowrap text-heading">
          {project.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-3 px-5">
        <p className="text-sm text-body">{project.summary}</p>
        <div className="flex flex-wrap justify-center gap-1.5">
          {project.techStack.map((tech) => (
            <Badge key={tech} variant="secondary">
              {tech}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const className = "group block transition-transform duration-200 hover:scale-[1.02]";

  // `liveUrl` set (MVP case, e.g. a project without a case-study page yet): the whole card
  // opens the live site in a new tab instead of the internal `/project/[slug]` detail page.
  if (project.liveUrl) {
    return (
      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className={className}>
        {cardBody}
      </a>
    );
  }

  return (
    <Link href={`/project/${project.slug}`} className={className}>
      {cardBody}
    </Link>
  );
}

function ComingSoonCard({ label }: { label: string }) {
  return (
    // Same anatomy as ProjectCard: the border belongs to the image-slot box only, nothing below
    // it (there's nothing below it here — no title/description for a filler card).
    <Card className="h-full items-center gap-4 overflow-visible rounded-none border-0 bg-transparent p-0 ring-0">
      <div className="flex aspect-[16/10] w-full items-center justify-center rounded-[28px] border border-dashed border-black/10 bg-muted/40">
        <span className="text-sm font-medium text-body">{label}</span>
      </div>
    </Card>
  );
}
