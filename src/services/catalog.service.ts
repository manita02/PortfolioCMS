import { unstable_cache } from "next/cache";
import { cacheTags } from "@/lib/cache-tags";
import {
  createPublicClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import type { CatalogItem } from "@/types/domain";

function mapCatalog(row: Record<string, unknown>): CatalogItem {
  return {
    id: row.id as string,
    name: row.name as string,
    sortOrder: (row.sort_order as number) ?? 0,
  };
}

async function fetchCatalog(table: string): Promise<CatalogItem[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from(table)
    .select("id, name, sort_order")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error || !data) return [];
  return data.map((row) => mapCatalog(row as Record<string, unknown>));
}

function cachedCatalog(table: string, key: string) {
  return unstable_cache(() => fetchCatalog(table), [key], {
    tags: [cacheTags.catalogs],
  })();
}

export function getOrganizationTypes() {
  return cachedCatalog("organization_types", "organization-types");
}

export function getExperienceTypes() {
  return cachedCatalog("experience_types", "experience-types");
}

export function getExperienceModalities() {
  return cachedCatalog("experience_modalities", "experience-modalities");
}

export function getEducationTypes() {
  return cachedCatalog("education_types", "education-types");
}

export function getSkillTypes() {
  return cachedCatalog("skill_types", "skill-types");
}

export function getSocialLinkTypes() {
  return cachedCatalog("social_link_types", "social-link-types");
}
