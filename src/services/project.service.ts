import { unstable_cache } from "next/cache";
import { cacheTags } from "@/lib/cache-tags";
import {
  createClient,
  createPublicClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import type { Project } from "@/types/domain";
import { mapProject } from "@/services/mappers";

const select = `
  *,
  organizations(*),
  project_skills(
    skill_id,
    skills(*)
  )
`;

async function fetchProjects(options?: {
  featuredOnly?: boolean;
  limit?: number;
}): Promise<Project[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createPublicClient();
  let query = supabase
    .from("projects")
    .select(select)
    .order("sort_order", { ascending: true })
    .order("start_year", { ascending: false });

  if (options?.featuredOnly) query = query.eq("is_featured", true);
  if (options?.limit) query = query.limit(options.limit);

  const { data, error } = await query;
  if (error || !data) return [];
  return data.map((row) => mapProject(row as Record<string, unknown>));
}

async function fetchProjectBySlug(slug: string): Promise<Project | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("projects")
    .select(select)
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return null;
  return mapProject(data as Record<string, unknown>);
}

export function getProjects(options?: {
  featuredOnly?: boolean;
  limit?: number;
}) {
  return unstable_cache(
    () => fetchProjects(options),
    [
      "projects",
      String(options?.featuredOnly ?? false),
      String(options?.limit ?? "all"),
    ],
    { tags: [cacheTags.projects] },
  )();
}

export function getProjectBySlug(slug: string) {
  return unstable_cache(
    () => fetchProjectBySlug(slug),
    ["project", slug],
    { tags: [cacheTags.projects, cacheTags.project(slug)] },
  )();
}

export async function getRelatedProjects(
  project: Project,
  limit = 3,
): Promise<Project[]> {
  const all = await getProjects();
  const skillIds = new Set(project.skills.map((s) => s.id));

  return all
    .filter((p) => p.id !== project.id)
    .map((p) => ({
      project: p,
      score: p.skills.reduce(
        (acc, s) => acc + (skillIds.has(s.id) ? 1 : 0),
        0,
      ),
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.project.sortOrder - b.project.sortOrder)
    .slice(0, limit)
    .map((x) => x.project);
}

export async function getProjectsRaw() {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select(select)
    .order("sort_order", { ascending: true });
  return (data ?? []) as import("@/features/admin/types/rows").ProjectAdminRow[];
}
