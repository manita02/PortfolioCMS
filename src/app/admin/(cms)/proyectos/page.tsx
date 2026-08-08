import { ProjectsManager } from "@/features/admin/components/projects-manager";
import { getOrganizationsRaw } from "@/services/organization.service";
import { getProjectsRaw } from "@/services/project.service";
import { getSkillsRaw } from "@/services/skill.service";

export default async function AdminProjectsPage() {
  const [items, organizations, skillsRaw] = await Promise.all([
    getProjectsRaw(),
    getOrganizationsRaw(),
    getSkillsRaw(),
  ]);

  const skills = skillsRaw.map((s) => ({
    id: s.id,
    name: s.name,
    typeId: s.type_id,
  }));

  return (
    <ProjectsManager
      items={items}
      organizations={organizations}
      skills={skills}
      title="Proyectos"
      description="Portfolio de proyectos."
    />
  );
}
