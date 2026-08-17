import { getTranslations } from "next-intl/server";
import { Accordion } from "@base-ui/react/accordion";

import { AccordionSectionHeading } from "@/components/accordion-section-heading";
import { EducationList } from "@/components/education-list";
import { getEducation } from "@/lib/content";

export async function EducationSection() {
  const t = await getTranslations("education");
  const education = getEducation();

  return (
    // Collapsible on mobile (8c) — see 8c-homepage-mobile-accordion.md.
    <Accordion.Item
      value="education"
      render={
        <section
          id="education"
          className="mx-auto w-full max-w-[1800px] px-[clamp(1.5rem,4vw,6rem)] py-[clamp(1.5rem,4vh,3rem)]"
        />
      }
    >
      <div className="mx-auto max-w-2xl text-center">
        <AccordionSectionHeading title={t("heading")} barColorClass="bg-accent-red" />
      </div>

      <Accordion.Panel className="accordion-panel overflow-hidden lg:block lg:overflow-visible lg:[content-visibility:visible]">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mt-3 text-[clamp(0.95rem,0.4vw+0.85rem,1.125rem)] text-body">
            {t("subheading")}
          </p>
        </div>

        <EducationList education={education} />
      </Accordion.Panel>
    </Accordion.Item>
  );
}
