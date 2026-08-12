import { getTranslations, getLocale } from "next-intl/server";
import {
  siTypescript,
  siJavascript,
  siPython,
  siNextdotjs,
  siReact,
  siNodedotjs,
  siPostgresql,
  siMysql,
  siMongodb,
  siSupabase,
  siFigma,
  siGit,
  siDocker,
  siVercel,
  type SimpleIcon,
} from "simple-icons";

import { getTechnologies, getMethodologies, getCertificates } from "@/lib/content";
import { CertificatesList } from "@/components/certificates-list";

// Named imports (not a dynamic lookup) so the bundler tree-shakes unused brand icons.
const ICONS_BY_SLUG: Record<string, SimpleIcon> = {
  typescript: siTypescript,
  javascript: siJavascript,
  python: siPython,
  nextdotjs: siNextdotjs,
  react: siReact,
  nodedotjs: siNodedotjs,
  postgresql: siPostgresql,
  mysql: siMysql,
  mongodb: siMongodb,
  supabase: siSupabase,
  figma: siFigma,
  git: siGit,
  docker: siDocker,
  vercel: siVercel,
};

// Cycled by declared position (blue, yellow, red, green), matching the pattern already
// used for Experience's marker dots and Projects' year badge.
// Yellow is a one-off darker shade (user-provided oklch), not the shared --color-accent-yellow token.
const APPROACH_CLASSES = [
  "bg-accent-blue",
  "bg-[oklch(0.8655_0.1595_96)]",
  "bg-accent-red",
  "bg-accent-green",
] as const;

// Server Component: Technologies/Approach stay static (see 08-skills-about-contacts.md).
// Certificates are expandable on click (2026-08-12) — delegated to the client
// CertificatesList component below, same lightbox pattern as Education's diplomas.
export async function SkillsSection() {
  const t = await getTranslations("skills");
  const locale = await getLocale();
  const technologies = getTechnologies();
  const methodologies = getMethodologies();
  const certificates = getCertificates();

  return (
    <section
      id="skills"
      className="mx-auto w-full max-w-[1800px] px-[clamp(1.5rem,4vw,6rem)] pt-[clamp(1.5rem,4vh,3rem)] pb-[clamp(3rem,8vh,6rem)]"
    >
      <h2 className="text-center text-[clamp(1.5rem,1rem+2vw,2.5rem)] font-bold text-heading">
        {t("heading")}
      </h2>

      <div className="mt-[clamp(2rem,5vh,3.5rem)] flex flex-col gap-[clamp(2rem,5vw,4rem)] lg:flex-row">
        <div className="lg:flex-1">
          <p className="text-[clamp(0.8rem,0.3vw+0.75rem,0.9rem)] text-body">
            {t("technologiesLabel")}
          </p>
          <ul className="mt-[clamp(0.75rem,2vw,1.25rem)] grid grid-cols-3 gap-[clamp(1rem,3vw,1.75rem)] lg:grid-cols-4">
            {technologies.map((tech) => {
              const icon = ICONS_BY_SLUG[tech.iconSlug];
              return (
                <li key={tech.id} title={tech.label}>
                  <svg
                    role="img"
                    viewBox="0 0 24 24"
                    className="h-[clamp(1.75rem,4vw,2.5rem)] w-[clamp(1.75rem,4vw,2.5rem)]"
                    style={{ fill: `#${icon.hex}` }}
                    aria-label={tech.label}
                  >
                    <path d={icon.path} />
                  </svg>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="lg:flex-1">
          <p className="text-[clamp(0.8rem,0.3vw+0.75rem,0.9rem)] text-body">
            {t("approachLabel")}
          </p>
          <ul className="mt-[clamp(0.75rem,2vw,1.25rem)] flex flex-col gap-[clamp(0.5rem,1.5vw,0.875rem)]">
            {methodologies.map((methodology, index) => (
              <li
                key={methodology.label.en}
                className={`rounded-full ${APPROACH_CLASSES[index % APPROACH_CLASSES.length]} px-[clamp(1rem,2vw,1.5rem)] py-[clamp(0.625rem,1.5vw,0.875rem)] font-bold text-on-accent`}
              >
                {methodology.label[locale as "en" | "it"]}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Certificates: its own subsection below Technologies/Approach (not a third side-by-side
          column, per user correction), laid out as two columns — one per certificate, each an
          [image] + label pair on a single line, same "small logo + label" idiom as the
          Technologies icons above. Each image is a cropped screenshot of the real PDF
          certificate (no brand icon exists for these), sized to the icon row's height so it
          reads as the same visual language. `whitespace-nowrap` keeps each pair on one line;
          columns stack on narrow viewports (`grid-cols-1 sm:grid-cols-2`). */}
      <div className="mt-[clamp(2rem,5vh,3.5rem)]">
        <p className="text-[clamp(0.8rem,0.3vw+0.75rem,0.9rem)] text-body">
          {t("certificatesLabel")}
        </p>
        <CertificatesList certificates={certificates} />
      </div>
    </section>
  );
}
