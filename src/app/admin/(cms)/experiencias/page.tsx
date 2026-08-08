import { ExperiencesManager } from "@/features/admin/components/experiences-manager";
import {
  getExperienceModalities,
  getExperienceTypes,
} from "@/services/catalog.service";
import { getExperiencesRaw } from "@/services/experience.service";
import { getOrganizationsRaw } from "@/services/organization.service";
import { getSkillsRaw } from "@/services/skill.service";

export default async function AdminExperiencesPage() {
  const [items, organizations, skillsRaw, types, modalities] =
    await Promise.all([
      getExperiencesRaw(),
      getOrganizationsRaw(),
      getSkillsRaw(),
      getExperienceTypes(),
      getExperienceModalities(),
    ]);

  const skills = skillsRaw.map((s) => ({
    id: s.id,
    name: s.name,
    typeId: s.type_id,
  }));

  return (
    <ExperiencesManager
      items={items}
      organizations={organizations}
      skills={skills}
      types={types}
      modalities={modalities}
      title="Experiencias"
      description="Roles y trayectoria laboral."
    />
  );
}
