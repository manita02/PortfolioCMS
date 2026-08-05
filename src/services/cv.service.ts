import { getCertificates } from "@/services/certificate.service";
import { getEducations } from "@/services/education.service";
import { getExperiences } from "@/services/experience.service";
import { getPerson } from "@/services/person.service";
import { getProjects } from "@/services/project.service";
import { getSkills } from "@/services/skill.service";
import { getSocialLinks } from "@/services/social-link.service";
import type { CvData } from "@/types/domain";

export async function getCvData(): Promise<CvData> {
  const [
    person,
    experiences,
    educations,
    projects,
    skills,
    certificates,
    socialLinks,
  ] = await Promise.all([
    getPerson(),
    getExperiences(),
    getEducations(),
    getProjects(),
    getSkills(),
    getCertificates(),
    getSocialLinks(),
  ]);

  return {
    person,
    experiences,
    educations,
    projects,
    skills,
    certificates,
    socialLinks,
  };
}
