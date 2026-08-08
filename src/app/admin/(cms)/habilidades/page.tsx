import { SkillsManager } from "@/features/admin/components/skills-manager";
import { getSkillTypes } from "@/services/catalog.service";
import { getSkillsRaw } from "@/services/skill.service";

export default async function AdminSkillsPage() {
  const [items, types] = await Promise.all([
    getSkillsRaw(),
    getSkillTypes(),
  ]);

  return (
    <SkillsManager
      items={items}
      types={types}
      title="Habilidades"
      description="Stack técnico y soft skills."
    />
  );
}
