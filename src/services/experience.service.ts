import { unstable_cache } from "next/cache";
import { cacheTags } from "@/lib/cache-tags";
import {
  createClient,
  createPublicClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import type { Experience } from "@/types/domain";
import { mapExperience } from "@/services/mappers";

const select = `
  *,
  experience_types ( id, name, sort_order ),
  experience_modalities ( id, name, sort_order ),
  organizations (
    *,
    organization_types ( id, name, sort_order )
  ),
  experience_skills (
    skill_id,
    skills (
      *,
      skill_types ( id, name, sort_order )
    )
  )
`;

async function fetchExperiences(limit?: number): Promise<Experience[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createPublicClient();
  let query = supabase
    .from("experiences")
    .select(select)
    .order("is_current", { ascending: false })
    .order("end_year", { ascending: false, nullsFirst: false })
    .order("end_month", { ascending: false, nullsFirst: false })
    .order("start_year", { ascending: false })
    .order("start_month", { ascending: false })
    .order("id", { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error || !data) return [];
  return data.map((row) => mapExperience(row as Record<string, unknown>));
}

export function getExperiences(limit?: number) {
  return unstable_cache(
    () => fetchExperiences(limit),
    ["experiences", String(limit ?? "all")],
    { tags: [cacheTags.experiences] },
  )();
}

export async function getExperiencesRaw() {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("experiences")
    .select(select)
    .order("is_current", { ascending: false })
    .order("end_year", { ascending: false, nullsFirst: false })
    .order("end_month", { ascending: false, nullsFirst: false })
    .order("start_year", { ascending: false })
    .order("start_month", { ascending: false })
    .order("id", { ascending: false });
  return (data ?? []) as import("@/features/admin/types/rows").ExperienceAdminRow[];
}
