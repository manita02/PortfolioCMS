import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { AboutSection } from "@/features/home/components/about-section";
import { FinalCtaSection } from "@/features/home/components/final-cta-section";
import { HeroSection } from "@/features/home/components/hero-section";
import { EducationSection } from "@/features/education/components/education-section";
import { ExperienceSection } from "@/features/experiences/components/experience-section";
import { ProjectsSection } from "@/features/projects/components/projects-section";
import { SkillsSection } from "@/features/skills/components/skills-section";
import { skillTypeIds } from "@/constants/catalog-ids";
import { cn } from "@/lib/utils";
import { getEducations } from "@/services/education.service";
import { getExperiences } from "@/services/experience.service";
import { getPerson } from "@/services/person.service";
import { getProjects } from "@/services/project.service";
import { getSkills } from "@/services/skill.service";
import { getSocialLinks } from "@/services/social-link.service";

export default async function AdminPreviewPage() {
  const portfolioUrl = siteConfig.getUrl();

  const [person, skills, experiences, educations, projects, socialLinks] =
    await Promise.all([
      getPerson(),
      getSkills(),
      getExperiences(3),
      getEducations(2),
      getProjects({ featuredOnly: true, limit: 3 }),
      getSocialLinks(),
    ]);

  const githubUrl =
    socialLinks.find((l) => l.name.toLowerCase().includes("github"))?.url ??
    socialLinks.find((l) => l.url.toLowerCase().includes("github.com"))?.url ??
    null;

  const highlightSkills = skills
    .filter(
      (s) =>
        s.typeId === skillTypeIds.language ||
        s.typeId === skillTypeIds.framework,
    )
    .slice(0, 6);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <p className="text-muted-foreground max-w-xl text-sm">
          Vista previa del portfolio público con el contenido actual.
        </p>
        <Link
          href={portfolioUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          <ExternalLink className="size-3.5" />
          Ver portfolio
        </Link>
      </div>

      <div className="bg-background overflow-hidden rounded-2xl border border-border shadow-sm">
        <HeroSection person={person} highlightSkills={highlightSkills} />
        <AboutSection
          title="Sobre mí"
          person={person}
          socialLinks={socialLinks}
        />
        <SkillsSection
          title="Habilidades"
          skills={skills}
          emptyLabel="Aún no hay contenido."
        />
        <ExperienceSection
          title="Experiencia"
          items={experiences}
          presentLabel="Actualidad"
          seeAllLabel="Ver todos"
          emptyLabel="Aún no hay contenido."
          summary
        />
        <EducationSection
          title="Educación"
          items={educations}
          presentLabel="Actualidad"
          seeAllLabel="Ver todos"
          emptyLabel="Aún no hay contenido."
          summary
        />
        <ProjectsSection
          title="Proyectos"
          items={projects}
          seeAllLabel="Ver todos"
          seeLabel="Ver proyecto"
          emptyLabel="Aún no hay contenido."
          summary
        />
        <FinalCtaSection githubUrl={githubUrl} email={person?.email} />
      </div>
    </div>
  );
}
