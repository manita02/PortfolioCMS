"use server";

import { revalidateTag } from "next/cache";
import { cacheTags } from "@/lib/cache-tags";
import { requireAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  experienceSchema,
  type ExperienceInput,
} from "@/features/admin/schemas/experience";

export async function upsertExperienceAction(input: ExperienceInput) {
  await requireAdmin();
  const data = experienceSchema.parse(input);
  const supabase = await createClient();

  const payload = {
    organization_id: data.organizationId,
    type_id: data.typeId,
    start_month: data.startMonth,
    start_year: data.startYear,
    end_month: data.isCurrent ? null : (data.endMonth ?? null),
    end_year: data.isCurrent ? null : (data.endYear ?? null),
    is_current: data.isCurrent,
    sort_order: data.sortOrder,
    title: data.title,
    description: data.description,
  };

  let id = data.id;
  if (id) {
    const { error } = await supabase
      .from("experiences")
      .update(payload)
      .eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { data: created, error } = await supabase
      .from("experiences")
      .insert(payload)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    id = created.id;
  }

  await supabase.from("experience_skills").delete().eq("experience_id", id);
  if (data.skillIds.length) {
    const { error } = await supabase.from("experience_skills").insert(
      data.skillIds.map((skill_id) => ({ experience_id: id, skill_id })),
    );
    if (error) throw new Error(error.message);
  }

  revalidateTag(cacheTags.experiences);
  revalidateTag(cacheTags.cv);
}

export async function deleteExperienceAction(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("experiences").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateTag(cacheTags.experiences);
  revalidateTag(cacheTags.cv);
}
