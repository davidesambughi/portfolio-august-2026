import { getTranslations } from "next-intl/server";

import { EducationList } from "@/components/education-list";
import { getEducation } from "@/lib/content";

export async function EducationSection() {
  const t = await getTranslations("education");
  const education = getEducation();

  return (
    <section
      id="education"
      className="mx-auto w-full max-w-[1800px] px-[clamp(1.5rem,4vw,6rem)] py-[clamp(1.5rem,4vh,3rem)]"
    >
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-[clamp(1.5rem,1rem+2vw,2.5rem)] font-bold text-heading">
          {t("heading")}
        </h2>
        <p className="mt-3 text-[clamp(0.95rem,0.4vw+0.85rem,1.125rem)] text-body">
          {t("subheading")}
        </p>
      </div>

      <EducationList education={education} />
    </section>
  );
}
