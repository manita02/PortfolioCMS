import { unstable_cache } from "next/cache";
import { cacheTags } from "@/lib/cache-tags";
import {
  createPublicClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import type { Organization } from "@/types/domain";
import { mapOrganization } from "@/services/mappers";

const organizationSelect = `
  *,
  organization_types ( id, name, sort_order )
`;

async function fetchOrganizations(): Promise<Organization[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("organizations")
    .select(organizationSelect)
    .order("name", { ascending: true });

  if (error || !data) return [];
  return data
    .map((row) => mapOrganization(row as Record<string, unknown>))
    .filter((o): o is Organization => Boolean(o));
}

export function getOrganizations() {
  return unstable_cache(() => fetchOrganizations(), ["organizations"], {
    tags: [cacheTags.organizations],
  })();
}

export async function getOrganizationsRaw(): Promise<Organization[]> {
  return fetchOrganizations();
}
