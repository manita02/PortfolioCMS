import { SkillsManager } from "@/features/admin/components/skills-manager";
import { getSkillsRaw } from "@/services/skill.service";

export default async function AdminSkillsPage() {
  const items = await getSkillsRaw();

  return (
    <SkillsManager
      items={items}
      title="Habilidades"
      description="Stack técnico y soft skills."
    />
  );
}
