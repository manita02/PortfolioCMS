import { EducationsManager } from "@/features/admin/components/educations-manager";
import { getEducationTypes } from "@/services/catalog.service";
import { getEducationsRaw } from "@/services/education.service";
import { getOrganizationsRaw } from "@/services/organization.service";
import { getSkillsRaw } from "@/services/skill.service";

export default async function AdminEducationPage() {
  const [items, organizations, skillsRaw, types] = await Promise.all([
    getEducationsRaw(),
    getOrganizationsRaw(),
    getSkillsRaw(),
    getEducationTypes(),
  ]);

  const skills = skillsRaw.map((s) => ({
    id: s.id,
    name: s.name,
    typeId: s.type_id,
  }));

  return (
    <EducationsManager
      items={items}
      organizations={organizations}
      skills={skills}
      types={types}
      title="Educación"
      description="Formación académica y cursos."
    />
  );
}
