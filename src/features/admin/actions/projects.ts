"use server";

import { revalidateTag } from "next/cache";
import {
  projectSchema,
  type ProjectInput,
} from "@/features/admin/schemas/project";
import { cacheTags } from "@/lib/cache-tags";
import { requireAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slugs";

export async function upsertProjectAction(input: ProjectInput) {
  await requireAdmin();
  const data = projectSchema.parse(input);
  const supabase = await createClient();
  const slug = data.slug?.trim() || slugify(data.name);

  const payload = {
    organization_id: data.organizationId || null,
    slug,
    name: data.name,
    summary: data.summary,
    description: data.description,
    start_month: data.startMonth ?? null,
    start_year: data.startYear ?? null,
    end_month: data.endMonth ?? null,
    end_year: data.endYear ?? null,
    image_path: data.imagePath ?? null,
    github_url: data.githubUrl || null,
    live_url: data.liveUrl || null,
    is_featured: data.isFeatured,
    sort_order: data.sortOrder,
  };

  let id = data.id;
  if (id) {
    const { error } = await supabase
      .from("projects")
      .update(payload)
      .eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { data: created, error } = await supabase
      .from("projects")
      .insert(payload)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    id = created.id;
  }

  await supabase.from("project_skills").delete().eq("project_id", id);
  if (data.skillIds.length) {
    const { error } = await supabase.from("project_skills").insert(
      data.skillIds.map((skill_id) => ({ project_id: id, skill_id })),
    );
    if (error) throw new Error(error.message);
  }

  revalidateTag(cacheTags.projects);
  revalidateTag(cacheTags.project(slug));
  revalidateTag(cacheTags.cv);
}

export async function deleteProjectAction(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateTag(cacheTags.projects);
  revalidateTag(cacheTags.cv);
}
