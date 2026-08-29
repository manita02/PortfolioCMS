"use server";

import { revalidateTag } from "next/cache";
import { cacheTags } from "@/lib/cache-tags";
import { requireAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  organizationSchema,
  type OrganizationInput,
} from "@/features/admin/schemas/organization";

export async function upsertOrganizationAction(input: OrganizationInput) {
  await requireAdmin();
  const data = organizationSchema.parse(input);
  const supabase = await createClient();
  const payload = {
    name: data.name,
    type_id: data.typeId,
    website_url: data.websiteUrl || null,
    logo_path: data.logoPath ?? null,
    location: data.location?.trim() || null,
    description: data.description,
  };

  let id = data.id;
  if (id) {
    const { error } = await supabase
      .from("organizations")
      .update(payload)
      .eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { data: created, error } = await supabase
      .from("organizations")
      .insert(payload)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    id = created.id;
  }

  revalidateTag(cacheTags.organizations);
  revalidateTag(cacheTags.person);
}

export async function deleteOrganizationAction(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("organizations").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateTag(cacheTags.organizations);
  revalidateTag(cacheTags.person);
}
