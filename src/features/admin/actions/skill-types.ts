"use server";

import { revalidateTag } from "next/cache";
import { skillTypeIds } from "@/constants/catalog-ids";
import {
  skillTypeSchema,
  type SkillTypeInput,
} from "@/features/admin/schemas/skill-type";
import { cacheTags } from "@/lib/cache-tags";
import { requireAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

function revalidateSkillTypeCaches() {
  revalidateTag(cacheTags.catalogs);
  revalidateTag(cacheTags.skills);
  revalidateTag(cacheTags.cv);
}

export async function upsertSkillTypeAction(input: SkillTypeInput) {
  await requireAdmin();
  const data = skillTypeSchema.parse(input);
  const supabase = await createClient();
  const payload = {
    name: data.name,
    sort_order: data.sortOrder,
  };

  if (data.id) {
    const { error } = await supabase
      .from("skill_types")
      .update(payload)
      .eq("id", data.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("skill_types").insert(payload);
    if (error) throw new Error(error.message);
  }

  revalidateSkillTypeCaches();
}

export async function deleteSkillTypeAction(id: string) {
  await requireAdmin();
  if (id === skillTypeIds.hidden) {
    throw new Error("system type");
  }

  const supabase = await createClient();
  const { count, error: countError } = await supabase
    .from("skills")
    .select("id", { count: "exact", head: true })
    .eq("type_id", id);

  if (countError) throw new Error(countError.message);
  if ((count ?? 0) > 0) {
    throw new Error("foreign key");
  }

  const { error } = await supabase.from("skill_types").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidateSkillTypeCaches();
}
