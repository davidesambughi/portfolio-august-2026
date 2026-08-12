import { AboutSection } from "@/components/about-section";
import { EducationSection } from "@/components/education-section";
import { ExperienceSection } from "@/components/experience-section";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Nav } from "@/components/nav";
import { ProjectsSection } from "@/components/projects-section";
import { SkillsSection } from "@/components/skills-section";

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <main className="flex flex-1 flex-col">
        <Hero />
        <Nav />
        <ProjectsSection />
        <EducationSection />
        <ExperienceSection />
        <SkillsSection />
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
}
