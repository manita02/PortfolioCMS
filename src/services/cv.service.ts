import { getEducations } from "@/services/education.service";
import { getExperiences } from "@/services/experience.service";
import { getPerson } from "@/services/person.service";
import { getProjects } from "@/services/project.service";
import { getSkills } from "@/services/skill.service";
import { getSocialLinks } from "@/services/social-link.service";
import type { CvData } from "@/types/domain";

export async function getCvData(): Promise<CvData> {
  const [person, experiences, educations, projects, skills, socialLinks] =
    await Promise.all([
      getPerson(),
      getExperiences(),
      getEducations(),
      getProjects(),
      getSkills(),
      getSocialLinks(),
    ]);

  return {
    person,
    experiences,
    educations,
    projects,
    skills,
    socialLinks,
  };
}
