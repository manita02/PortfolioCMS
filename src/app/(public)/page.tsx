import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/config/site";
import { AboutSection } from "@/features/home/components/about-section";
import { FinalCtaSection } from "@/features/home/components/final-cta-section";
import { HeroSection } from "@/features/home/components/hero-section";
import { EducationSection } from "@/features/education/components/education-section";
import { ExperienceSection } from "@/features/experiences/components/experience-section";
import { ProjectsSection } from "@/features/projects/components/projects-section";
import { SkillsSection } from "@/features/skills/components/skills-section";
import { skillTypeIds } from "@/constants/catalog-ids";
import { storageBuckets } from "@/constants/storage-buckets";
import { buildMetadata } from "@/lib/seo";
import { getPublicStorageUrl } from "@/lib/storage-url";
import { getEducations } from "@/services/education.service";
import { getExperiences } from "@/services/experience.service";
import { getPerson } from "@/services/person.service";
import { getProjects } from "@/services/project.service";
import { getSkills } from "@/services/skill.service";
import { getSocialLinks } from "@/services/social-link.service";

export async function generateMetadata() {
  const person = await getPerson();
  const title =
    person?.metaTitle ||
    (person ? `${person.firstName} ${person.lastName}` : siteConfig.name);
  const description =
    person?.metaDescription || person?.subtitle || siteConfig.description;
  const image = getPublicStorageUrl(
    storageBuckets.person,
    person?.bannerImagePath,
  );

  return buildMetadata({
    title,
    description,
    image,
  });
}

export default async function HomePage() {
  const [person, skills, experiences, educations, projects, socialLinks] =
    await Promise.all([
      getPerson(),
      getSkills(),
      getExperiences(3),
      getEducations(2),
      getProjects({ featuredOnly: true, limit: 3 }),
      getSocialLinks(),
    ]);

  const fullName = person
    ? `${person.firstName} ${person.lastName}`
    : siteConfig.name;

  const highlightSkills = skills
    .filter(
      (s) =>
        s.typeId === skillTypeIds.language ||
        s.typeId === skillTypeIds.framework,
    )
    .slice(0, 6);

  const githubUrl =
    socialLinks.find((l) => l.name.toLowerCase().includes("github"))?.url ??
    socialLinks.find((l) => l.url.toLowerCase().includes("github.com"))?.url ??
    null;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: fullName,
          jobTitle: person?.professionalTitle,
          description: person?.about,
          email: person?.email ?? undefined,
          url: siteConfig.getUrl(),
          image: getPublicStorageUrl(
            storageBuckets.person,
            person?.profileImagePath,
          ),
          sameAs: socialLinks.map((l) => l.url),
        }}
      />
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
    </>
  );
}
