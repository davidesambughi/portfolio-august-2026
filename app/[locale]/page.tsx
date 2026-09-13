import { AboutSection } from "@/components/about-section";
import { EducationSection } from "@/components/education-section";
import { ExperienceSection } from "@/components/experience-section";
import { Footer } from "@/components/footer";
import { MobileAccordionShell } from "@/components/mobile-accordion-shell";
import { ProjectsSection } from "@/components/projects-section";
import { HeroChapter } from "@/components/scrollytelling/hero-chapter";
import { ScrollChrome } from "@/components/scrollytelling/scroll-chrome";
import { SkillsSection } from "@/components/skills-section";

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <ScrollChrome />
      <main className="flex flex-1 flex-col">
        <HeroChapter />
        <MobileAccordionShell>
          <ProjectsSection />
          <EducationSection />
          <ExperienceSection />
          <SkillsSection />
          <AboutSection />
        </MobileAccordionShell>
      </main>
      <Footer />
    </div>
  );
}
