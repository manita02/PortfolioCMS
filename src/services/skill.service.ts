import { unstable_cache } from "next/cache";
import { cacheTags } from "@/lib/cache-tags";
import {
  createClient,
  createPublicClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import type { Skill } from "@/types/domain";
import { mapSkill } from "@/services/mappers";

const skillSelect = `
  *,
  skill_types ( id, name, sort_order )
`;

async function fetchSkills(): Promise<Skill[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("skills")
    .select(skillSelect)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error || !data) return [];
  return data.map((row) => mapSkill(row as Record<string, unknown>));
}

export function getSkills() {
  return unstable_cache(() => fetchSkills(), ["skills"], {
    tags: [cacheTags.skills],
  })();
}

/** Skills assigned to at least one project (for public project filters). */
async function fetchSkillsUsedByProjects(): Promise<Skill[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("skills")
    .select(
      `
      *,
      skill_types ( id, name, sort_order ),
      project_skills!inner ( project_id )
    `,
    )
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error || !data) return [];

  const unique = new Map<string, Skill>();
  for (const row of data) {
    const skill = mapSkill(row as Record<string, unknown>);
    if (!unique.has(skill.id)) unique.set(skill.id, skill);
  }
  return Array.from(unique.values());
}

export function getSkillsUsedByProjects() {
  return unstable_cache(
    () => fetchSkillsUsedByProjects(),
    ["skills-used-by-projects"],
    { tags: [cacheTags.skills, cacheTags.projects] },
  )();
}

export async function getSkillsRaw() {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("skills")
    .select(skillSelect)
    .order("sort_order", { ascending: true });
  return (data ?? []) as import("@/features/admin/types/rows").SkillAdminRow[];
}
