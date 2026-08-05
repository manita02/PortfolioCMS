import { unstable_cache } from "next/cache";
import { cacheTags } from "@/lib/cache-tags";
import {
  createClient,
  createPublicClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import type { Organization } from "@/types/domain";
import { mapOrganization } from "@/services/mappers";

async function fetchOrganizations(): Promise<Organization[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("organizations")
    .select("*")
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

export type OrganizationAdminRow = {
  id: string;
  name: string;
  type: Organization["type"];
  website_url: string | null;
  logo_path: string | null;
  location: string | null;
  description: string;
};

export async function getOrganizationsRaw(): Promise<Organization[]> {
  return fetchOrganizations();
}

export async function getOrganizationsAdminRaw(): Promise<OrganizationAdminRow[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("organizations")
    .select("*")
    .order("name", { ascending: true });
  if (error || !data) return [];
  return data as OrganizationAdminRow[];
}
