import { SkillTypesManager } from "@/features/admin/components/skill-types-manager";
import { getSkillTypes } from "@/services/catalog.service";

export default async function AdminSkillTypesPage() {
  const items = await getSkillTypes();

  return (
    <SkillTypesManager
      items={items}
      title="Tipos de habilidad"
      description="Categorías para agrupar el stack en el portfolio y el CV."
    />
  );
}
