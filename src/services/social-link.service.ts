import { unstable_cache } from "next/cache";
import { cacheTags } from "@/lib/cache-tags";
import {
  createPublicClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import type { SocialLink } from "@/types/domain";

const socialSelect = `
  *,
  social_link_types ( id, name, sort_order )
`;

function mapSocial(row: Record<string, unknown>): SocialLink {
  const type = row.social_link_types as
    | Record<string, unknown>
    | null
    | undefined;

  return {
    id: row.id as string,
    name: row.name as string,
    typeId: (row.type_id as string) ?? (type?.id as string) ?? "",
    typeName: (type?.name as string) ?? "",
    iconImage: (row.icon_image as string | null) ?? null,
    url: row.url as string,
    sortOrder: row.sort_order as number,
  };
}

async function fetchSocialLinks(): Promise<SocialLink[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("social_links")
    .select(socialSelect)
    .order("sort_order", { ascending: true });

  if (error || !data) return [];
  return data.map((row) => mapSocial(row as Record<string, unknown>));
}

export function getSocialLinks() {
  return unstable_cache(() => fetchSocialLinks(), ["social-links"], {
    tags: [cacheTags.socialLinks],
  })();
}
