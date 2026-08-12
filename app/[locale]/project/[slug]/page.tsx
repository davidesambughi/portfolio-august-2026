import { evaluate } from "@mdx-js/mdx";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { siGithub } from "simple-icons";
import * as runtime from "react/jsx-runtime";
import { Callout, CalloutItem } from "@/components/mdx/callout";
import { DashboardGallery, FlowDiagram } from "@/components/mdx/dashboard-gallery";
import { LegendBox } from "@/components/mdx/legend-box";
import { SectionImage } from "@/components/mdx/section-image";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { Toc } from "@/components/toc";
import { routing } from "@/i18n/routing";
import { getProjectBySlug, getProjectSlugs } from "@/lib/content";

// Prerenders every real project for both locales at build time (static site, no server runtime).
export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getProjectSlugs().map((slug) => ({ locale, slug })),
  );
}

export default async function ProjectDetailPage({
  params,
}: PageProps<"/[locale]/project/[slug]">) {
  const { locale, slug } = await params;
  const project = getProjectBySlug(locale, slug);

  if (!project) {
    notFound();
  }

  const t = await getTranslations("projectDetail");

  // Server-side MDX compilation via evaluate() — RSC-compatible, no client bundle for the MDX runtime.
  const { default: MDXContent } = await evaluate(project.content, {
    ...runtime,
    baseUrl: import.meta.url,
  });

  // Renders the tech-stack tag line inside the MDX flow (closed over frontmatter data, since
  // subtitleTags lives in ProjectMeta, not in the .mdx body itself). Captured as a local const
  // (not `project.subtitleTags` directly) so TypeScript's null-narrowing survives into the closure.
  const subtitleTags = project.subtitleTags;
  function TechTags() {
    return (
      <p className="not-prose mt-[clamp(1.5rem,3vw,2.5rem)] text-body">
        {subtitleTags.join(" · ")}
      </p>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <main className="flex flex-1 flex-col">
        <Nav />

        <div className="mx-auto w-full max-w-[1800px] px-[clamp(1.5rem,4vw,6rem)] pt-[clamp(1rem,3vw,2.5rem)] pb-[clamp(2rem,6vw,5rem)]">
          <header className="text-center">
            <h1 className="flex items-center justify-center gap-3 text-[clamp(1.875rem,1rem+3vw,3rem)] font-bold text-heading">
              {project.title}
              {project.githubUrl ? (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t("viewOnGithub")}
                  className="h-[clamp(1.25rem,3vw,1.75rem)] w-[clamp(1.25rem,3vw,1.75rem)] transition-opacity hover:opacity-70"
                >
                  <svg role="img" viewBox="0 0 24 24" className="h-full w-full" fill="currentColor">
                    <path d={siGithub.path} />
                  </svg>
                </a>
              ) : null}
            </h1>
            <p className="mt-2 text-[clamp(1rem,0.5rem+1vw,1.375rem)] font-bold text-subheading">
              {t("subheadline")}
            </p>
          </header>

          {/* Toc's visibility fades in once this sentinel has scrolled past the top of the
              viewport, and fades out again once toc-visibility-end (before Footer) comes into
              view — see components/toc.tsx. */}
          <div id="toc-visibility-start" />

          <div id="project-content" className="mt-[clamp(2.5rem,5vw,4rem)]">
            {/* Floated hero image — MDX paragraphs below wrap around it (lg+), Callout clears it. */}
            <div className="mb-[clamp(1rem,2vw,1.5rem)] w-full lg:float-right lg:ml-[clamp(1.5rem,3vw,2.5rem)] lg:w-[42%]">
              <div className="relative aspect-[19/10] overflow-hidden rounded-[20px] bg-muted">
                <Image
                  src={project.coverImage}
                  alt={project.title}
                  fill
                  className="object-contain"
                />
              </div>
              <p className="mt-2 text-center text-sm text-body">{project.summary}</p>
            </div>

            <div className="prose max-w-none text-center prose-strong:text-heading prose-li:text-body [&_ol>li::marker]:font-bold [&_ol>li::marker]:text-heading">
              <MDXContent
                components={{
                  Callout,
                  CalloutItem,
                  DashboardGallery,
                  FlowDiagram,
                  SectionImage,
                  LegendBox,
                  TechTags,
                }}
              />
            </div>
          </div>
        </div>
      </main>
      <div id="toc-visibility-end" />
      <Footer />
      <Toc />
    </div>
  );
}
