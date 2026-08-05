import { unstable_cache } from "next/cache";
import { cacheTags } from "@/lib/cache-tags";
import {
  createClient,
  createPublicClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import type { Skill } from "@/types/domain";

function mapSkill(row: Record<string, unknown>): Skill {
  return {
    id: row.id as string,
    name: row.name as string,
    type: row.type as Skill["type"],
    iconPath: (row.icon_path as string) ?? null,
    sortOrder: row.sort_order as number,
    label: (row.label as string) || (row.name as string),
  };
}

async function fetchSkills(): Promise<Skill[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("skills")
    .select("*")
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

export async function getSkillsRaw() {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("skills")
    .select("*")
    .order("sort_order", { ascending: true });
  return (data ?? []) as import("@/features/admin/types/rows").SkillAdminRow[];
}
