"use server";

import { revalidateTag } from "next/cache";
import {
  educationSchema,
  type EducationInput,
} from "@/features/admin/schemas/education";
import { cacheTags } from "@/lib/cache-tags";
import { requireAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function upsertEducationAction(input: EducationInput) {
  await requireAdmin();
  const data = educationSchema.parse(input);
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
    institution_image_path: data.institutionImagePath ?? null,
    diploma_image_path: data.diplomaImagePath ?? null,
    diploma_pdf_path: data.diplomaPdfPath ?? null,
    title: data.title,
    description: data.description,
  };

  let id = data.id;
  if (id) {
    const { error } = await supabase
      .from("educations")
      .update(payload)
      .eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { data: created, error } = await supabase
      .from("educations")
      .insert(payload)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    id = created.id;
  }

  await supabase.from("education_skills").delete().eq("education_id", id);
  if (data.skillIds.length) {
    const { error } = await supabase.from("education_skills").insert(
      data.skillIds.map((skill_id) => ({ education_id: id, skill_id })),
    );
    if (error) throw new Error(error.message);
  }

  revalidateTag(cacheTags.education);
  revalidateTag(cacheTags.cv);
}

export async function deleteEducationAction(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("educations").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateTag(cacheTags.education);
  revalidateTag(cacheTags.cv);
}
