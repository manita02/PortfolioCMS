import { ExperiencesManager } from "@/features/admin/components/experiences-manager";
import { getExperiencesRaw } from "@/services/experience.service";
import { getOrganizationsRaw } from "@/services/organization.service";
import { getSkillsRaw } from "@/services/skill.service";

export default async function AdminExperiencesPage() {
  const [items, organizations, skillsRaw] = await Promise.all([
    getExperiencesRaw(),
    getOrganizationsRaw(),
    getSkillsRaw(),
  ]);

  const skills = skillsRaw.map((s) => ({ id: s.id, name: s.name }));

  return (
    <ExperiencesManager
      items={items}
      organizations={organizations}
      skills={skills}
      title="Experiencias"
      description="Roles y trayectoria laboral."
    />
  );
}
