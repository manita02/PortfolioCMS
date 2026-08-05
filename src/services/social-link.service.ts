import { unstable_cache } from "next/cache";
import { cacheTags } from "@/lib/cache-tags";
import {
  createPublicClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import type { SocialLink } from "@/types/domain";

function mapSocial(row: Record<string, unknown>): SocialLink {
  return {
    id: row.id as string,
    name: row.name as string,
    type: (row.type as SocialLink["type"]) ?? "professional",
    iconKey: row.icon_key as string,
    url: row.url as string,
    sortOrder: row.sort_order as number,
    isVisible: row.is_visible as boolean,
  };
}

async function fetchSocialLinks(visibleOnly = true): Promise<SocialLink[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createPublicClient();
  let query = supabase
    .from("social_links")
    .select("*")
    .order("sort_order", { ascending: true });

  if (visibleOnly) query = query.eq("is_visible", true);

  const { data, error } = await query;
  if (error || !data) return [];
  return data.map((row) => mapSocial(row as Record<string, unknown>));
}

export function getSocialLinks() {
  return unstable_cache(() => fetchSocialLinks(true), ["social-links"], {
    tags: [cacheTags.socialLinks],
  })();
}

export async function getSocialLinksRaw() {
  return fetchSocialLinks(false);
}
