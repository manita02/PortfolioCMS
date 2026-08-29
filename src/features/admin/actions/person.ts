"use server";

import { revalidateTag } from "next/cache";
import { cacheTags } from "@/lib/cache-tags";
import { requireAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  personSchema,
  type PersonInput,
} from "@/features/admin/schemas/person";

export async function upsertPersonAction(input: PersonInput) {
  await requireAdmin();
  const data = personSchema.parse(input);
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("persons")
    .select("id")
    .limit(1)
    .maybeSingle();

  const currentExperienceId =
    data.currentlyWorking && data.currentExperienceId
      ? data.currentExperienceId
      : null;

  const payload = {
    first_name: data.firstName,
    last_name: data.lastName,
    email: data.email || null,
    availability_label: data.availabilityLabel,
    availability_text: data.availabilityText,
    currently_working: data.currentlyWorking,
    current_experience_id: currentExperienceId,
    profile_image_path: data.profileImagePath ?? null,
    banner_image_path: data.bannerImagePath ?? null,
    professional_title: data.professionalTitle,
    subtitle: data.subtitle,
    about: data.about,
    meta_title: data.metaTitle || null,
    meta_description: data.metaDescription || null,
  };

  if (existing?.id) {
    const { error } = await supabase
      .from("persons")
      .update(payload)
      .eq("id", existing.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("persons").insert(payload);
    if (error) throw new Error(error.message);
  }

  revalidateTag(cacheTags.person);
  revalidateTag(cacheTags.cv);
}
