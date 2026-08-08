"use server";

import { revalidateTag } from "next/cache";
import {
  skillSchema,
  type SkillInput,
} from "@/features/admin/schemas/skill";
import { cacheTags } from "@/lib/cache-tags";
import { requireAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function upsertSkillAction(input: SkillInput) {
  await requireAdmin();
  const data = skillSchema.parse(input);
  const supabase = await createClient();
  const payload = {
    name: data.name,
    type_id: data.typeId,
    icon_path: data.iconPath ?? null,
    destacada: data.destacada,
    label: data.label || data.name,
  };

  let skillId = data.id;
  if (skillId) {
    const { error } = await supabase
      .from("skills")
      .update(payload)
      .eq("id", skillId);
    if (error) throw new Error(error.message);
  } else {
    const { data: created, error } = await supabase
      .from("skills")
      .insert(payload)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    skillId = created.id;
  }

  revalidateTag(cacheTags.skills);
  revalidateTag(cacheTags.cv);
}

export async function deleteSkillAction(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("skills").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateTag(cacheTags.skills);
  revalidateTag(cacheTags.cv);
}
