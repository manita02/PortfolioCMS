import type { Skill } from "@/types/domain";

export type SkillGroup = {
  typeId: string;
  typeName: string;
  typeSortOrder: number;
  items: Skill[];
};

/** Skills marked for the public Hero, ordered by name ASC. */
export function getHeroSkills(skills: Skill[]): Skill[] {
  return skills
    .filter((skill) => skill.destacada)
    .sort((a, b) => a.name.localeCompare(b.name, "es", { sensitivity: "base" }));
}

/**
 * Group skills by type (excluding `hiddenTypeId`), types by typeSortOrder,
 * and items within each type by name ASC.
 */
export function groupSkillsByType(
  skills: Skill[],
  hiddenTypeId: string,
): SkillGroup[] {
  const byType = new Map<string, SkillGroup>();

  for (const skill of skills) {
    if (skill.typeId === hiddenTypeId) continue;
    const existing = byType.get(skill.typeId);
    if (existing) {
      existing.items.push(skill);
    } else {
      byType.set(skill.typeId, {
        typeId: skill.typeId,
        typeName: skill.typeName,
        typeSortOrder: skill.typeSortOrder,
        items: [skill],
      });
    }
  }

  return [...byType.values()]
    .map((group) => ({
      ...group,
      items: [...group.items].sort((a, b) =>
        a.name.localeCompare(b.name, "es", { sensitivity: "base" }),
      ),
    }))
    .sort(
      (a, b) =>
        a.typeSortOrder - b.typeSortOrder ||
        a.typeName.localeCompare(b.typeName, "es", { sensitivity: "base" }),
    );
}
