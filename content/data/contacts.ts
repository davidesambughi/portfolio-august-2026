// Icon component is chosen by the caller via `id` — only 3 fixed links, no dynamic icon-slug lookup needed.
export type ContactLink = {
  id: "linkedin" | "github" | "gmail";
  label: string;
  href: string;
};

export const contactLinks: ContactLink[] = [
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/davide-sambughi-358b903aa/",
  },
  {
    id: "github",
    label: "GitHub",
    href: "https://github.com/davidesambughi",
  },
  {
    id: "gmail",
    label: "Gmail",
    href: "mailto:davidesambughi@gmail.com",
  },
];
