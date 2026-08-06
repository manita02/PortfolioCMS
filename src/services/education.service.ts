import { unstable_cache } from "next/cache";
import { cacheTags } from "@/lib/cache-tags";
import {
  createClient,
  createPublicClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import type { Education } from "@/types/domain";
import { mapEducation } from "@/services/mappers";

const select = `
  *,
  education_types ( id, name, sort_order ),
  organizations (
    *,
    organization_types ( id, name, sort_order )
  ),
  education_skills (
    skill_id,
    skills (
      *,
      skill_types ( id, name, sort_order )
    )
  )
`;

async function fetchEducations(limit?: number): Promise<Education[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createPublicClient();
  let query = supabase
    .from("educations")
    .select(select)
    .order("is_carrera", { ascending: false })
    .order("is_current", { ascending: false })
    .order("end_year", { ascending: false, nullsFirst: false })
    .order("end_month", { ascending: false, nullsFirst: false })
    .order("start_year", { ascending: false })
    .order("start_month", { ascending: false })
    .order("id", { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error || !data) return [];
  return data.map((row) => mapEducation(row as Record<string, unknown>));
}

export function getEducations(limit?: number) {
  return unstable_cache(
    () => fetchEducations(limit),
    ["educations", String(limit ?? "all")],
    { tags: [cacheTags.education] },
  )();
}

export async function getEducationsRaw() {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("educations")
    .select(select)
    .order("is_carrera", { ascending: false })
    .order("is_current", { ascending: false })
    .order("end_year", { ascending: false, nullsFirst: false })
    .order("end_month", { ascending: false, nullsFirst: false })
    .order("start_year", { ascending: false })
    .order("start_month", { ascending: false })
    .order("id", { ascending: false });
  return (data ?? []) as import("@/features/admin/types/rows").EducationAdminRow[];
}
