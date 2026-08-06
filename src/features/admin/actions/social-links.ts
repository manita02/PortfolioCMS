"use server";

import { revalidateTag } from "next/cache";
import {
  socialLinkSchema,
  type SocialLinkInput,
} from "@/features/admin/schemas/social-link";
import { cacheTags } from "@/lib/cache-tags";
import { requireAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function upsertSocialLinkAction(input: SocialLinkInput) {
  await requireAdmin();
  const data = socialLinkSchema.parse(input);
  const supabase = await createClient();
  const payload = {
    name: data.name,
    type_id: data.typeId,
    icon_key: data.iconKey,
    url: data.url,
    sort_order: data.sortOrder,
    is_visible: data.isVisible,
  };

  if (data.id) {
    const { error } = await supabase
      .from("social_links")
      .update(payload)
      .eq("id", data.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("social_links").insert(payload);
    if (error) throw new Error(error.message);
  }

  revalidateTag(cacheTags.socialLinks);
}

export async function deleteSocialLinkAction(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("social_links").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateTag(cacheTags.socialLinks);
}
