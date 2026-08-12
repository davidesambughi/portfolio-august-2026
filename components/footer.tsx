import { getTranslations } from "next-intl/server";
import { siGithub, siGmail } from "simple-icons";
import { getContactLinks } from "@/lib/content";

// LinkedIn is permanently unavailable in simple-icons (removed v14.0.0, trademark reasons) —
// hardcoded standard 24x24 "in" badge glyph instead of a new icon dependency for one icon.
function LinkedInIcon() {
  return (
    <svg role="img" viewBox="0 0 24 24" className="h-full w-full" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const ICONS: Record<string, React.ReactNode> = {
  linkedin: <LinkedInIcon />,
  github: (
    <svg role="img" viewBox="0 0 24 24" className="h-full w-full" fill="currentColor">
      <path d={siGithub.path} />
    </svg>
  ),
  gmail: (
    <svg role="img" viewBox="0 0 24 24" className="h-full w-full" fill="currentColor">
      <path d={siGmail.path} />
    </svg>
  ),
};

// Interactive footer (real external links) — icons render plain grey, not brand colors,
// matching the mockup's flat glyph treatment (deliberate difference from Skills' colored icons).
export async function Footer() {
  const t = await getTranslations("contacts");
  const tHero = await getTranslations("hero");
  const links = getContactLinks();

  return (
    <footer
      id="contacts"
      className="border-t border-border bg-black/[0.03] backdrop-blur-sm"
    >
      <div className="mx-auto flex w-full max-w-[1800px] flex-wrap items-center justify-between gap-[clamp(1.5rem,4vw,2.5rem)] px-[clamp(1.5rem,4vw,6rem)] py-[clamp(2rem,6vh,4rem)]">
        <p className="text-[clamp(1rem,0.5vw+0.9rem,1.25rem)] text-heading">
          {tHero("name")}
          <br />
          <span className="font-bold">{tHero("role")}</span>
        </p>

        <div className="flex flex-wrap items-center gap-[clamp(1rem,3vw,1.75rem)]">
          <span className="text-[clamp(0.8rem,0.3vw+0.75rem,0.9rem)] text-body">
            {t("followMe")}
          </span>
          <span className="h-4 w-px bg-border" aria-hidden="true" />
          <div className="flex items-center gap-[clamp(1rem,3vw,1.5rem)]">
            {links.map((link) => (
              <a
                key={link.id}
                href={link.href}
                aria-label={link.label}
                target={link.id === "gmail" ? undefined : "_blank"}
                rel={link.id === "gmail" ? undefined : "noopener noreferrer"}
                className="block h-[clamp(1.125rem,2vw,1.375rem)] w-[clamp(1.125rem,2vw,1.375rem)] text-body transition-colors hover:text-heading focus-visible:text-heading"
              >
                {ICONS[link.id]}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
