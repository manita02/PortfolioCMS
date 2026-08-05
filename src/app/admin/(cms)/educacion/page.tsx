import { EducationsManager } from "@/features/admin/components/educations-manager";
import { getEducationsRaw } from "@/services/education.service";
import { getOrganizationsRaw } from "@/services/organization.service";
import { getSkillsRaw } from "@/services/skill.service";

export default async function AdminEducationPage() {
  const [items, organizations, skillsRaw] = await Promise.all([
    getEducationsRaw(),
    getOrganizationsRaw(),
    getSkillsRaw(),
  ]);

  const skills = skillsRaw.map((s) => ({ id: s.id, name: s.name }));

  return (
    <EducationsManager
      items={items}
      organizations={organizations}
      skills={skills}
      title="Educación"
      description="Formación académica y cursos."
    />
  );
}
