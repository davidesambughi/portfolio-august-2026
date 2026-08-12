import { Globe, LayoutDashboard, Users, Workflow, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

// Icon name -> component map, so .mdx authors reference icons by string (e.g. icon="users")
// instead of importing React components inside the MDX body.
const ICONS: Record<string, LucideIcon> = {
  users: Users,
  workflow: Workflow,
  "layout-dashboard": LayoutDashboard,
  globe: Globe,
};

// Full-width tinted box, used for the "roles / state machines / dashboards" summary on the
// project detail page. Authored directly as JSX inside a case study's .mdx body.
export function Callout({ children }: { children: ReactNode }) {
  return (
    <div className="not-prose clear-both mt-[clamp(2.5rem,5vw,4rem)] rounded-[24px] bg-accent-blue/10 p-[clamp(1.5rem,3vw,2.5rem)]">
      <div className="flex flex-col gap-[clamp(0.75rem,1.5vw,1.25rem)]">{children}</div>
    </div>
  );
}

export function CalloutItem({
  icon,
  label,
  children,
}: {
  icon: string;
  label: string;
  children: ReactNode;
}) {
  const Icon = ICONS[icon];

  return (
    <div className="flex items-start gap-3">
      {Icon ? <Icon className="mt-0.5 size-5 shrink-0 text-accent-blue" aria-hidden /> : null}
      {/* children arrives as a block-level <p> from MDX — force it inline so this never
          nests a <p> inside a <p> (invalid HTML, causes a hydration error). */}
      <div className="text-body [&>p]:m-0 [&>p]:inline">
        <span className="font-bold text-heading">{label}</span>
        {" — "}
        {children}
      </div>
    </div>
  );
}
