import { unstable_cache } from "next/cache";
import { cacheTags } from "@/lib/cache-tags";
import {
  createClient,
  createPublicClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import type { Person } from "@/types/domain";

function mapPerson(row: Record<string, unknown>): Person {
  return {
    id: row.id as string,
    firstName: row.first_name as string,
    lastName: row.last_name as string,
    email: (row.email as string) ?? null,
    profileImagePath: (row.profile_image_path as string) ?? null,
    bannerImagePath: (row.banner_image_path as string) ?? null,
    cvPdfPath: (row.cv_pdf_path as string) ?? null,
    availabilityStatus: row.availability_status as Person["availabilityStatus"],
    professionalTitle: (row.professional_title as string) ?? "",
    subtitle: (row.subtitle as string) ?? "",
    about: (row.about as string) ?? "",
    availabilityLabel: (row.availability_label as string) ?? "",
    metaTitle: (row.meta_title as string) ?? null,
    metaDescription: (row.meta_description as string) ?? null,
  };
}

async function fetchPerson(): Promise<Person | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("persons")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;
  return mapPerson(data as Record<string, unknown>);
}

export function getPerson() {
  return unstable_cache(() => fetchPerson(), ["person"], {
    tags: [cacheTags.person],
  })();
}

export async function getPersonRaw() {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("persons")
    .select("*")
    .limit(1)
    .maybeSingle();
  return data;
}
