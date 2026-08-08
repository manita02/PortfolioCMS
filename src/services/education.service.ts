import { unstable_cache } from "next/cache";
import { educationTypeIds } from "@/constants/catalog-ids";
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

  const { data, error } = await supabase
    .from("educations")
    .select(select)
    .order("is_current", { ascending: false })
    .order("end_year", { ascending: false, nullsFirst: false })
    .order("end_month", { ascending: false, nullsFirst: false })
    .order("start_year", { ascending: false })
    .order("start_month", { ascending: false })
    .order("id", { ascending: false });

  if (error || !data) return [];

  // Carrera primero; se conserva el orden cronológico dentro de cada grupo.
  const careerId = educationTypeIds.career;
  const career: typeof data = [];
  const other: typeof data = [];
  for (const row of data) {
    if (row.type_id === careerId) career.push(row);
    else other.push(row);
  }

  const ordered = [...career, ...other];
  const sliced = limit ? ordered.slice(0, limit) : ordered;
  return sliced.map((row) => mapEducation(row as Record<string, unknown>));
}

export function getEducations(limit?: number) {
  return unstable_cache(
    () => fetchEducations(limit),
    // v3: invalida caché vacía residual de consultas rotas (is_carrera / all)
    ["educations-v3", String(limit ?? "all")],
    { tags: [cacheTags.education] },
  )();
}

export async function getEducationsRaw() {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("educations")
    .select(select)
    .order("is_current", { ascending: false })
    .order("end_year", { ascending: false, nullsFirst: false })
    .order("end_month", { ascending: false, nullsFirst: false })
    .order("start_year", { ascending: false })
    .order("start_month", { ascending: false })
    .order("id", { ascending: false });

  if (error || !data) return [];

  const careerId = educationTypeIds.career;
  const career: typeof data = [];
  const other: typeof data = [];
  for (const row of data) {
    if (row.type_id === careerId) career.push(row);
    else other.push(row);
  }

  return [...career, ...other] as import("@/features/admin/types/rows").EducationAdminRow[];
}
