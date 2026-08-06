import { unstable_cache } from "next/cache";
import { cacheTags } from "@/lib/cache-tags";
import {
  createClient,
  createPublicClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import type { Person } from "@/types/domain";

const personSelect = `
  *,
  availability_statuses ( id, name, sort_order )
`;

function mapPerson(row: Record<string, unknown>): Person {
  const status = row.availability_statuses as
    | Record<string, unknown>
    | null
    | undefined;

  return {
    id: row.id as string,
    firstName: row.first_name as string,
    lastName: row.last_name as string,
    email: (row.email as string) ?? null,
    profileImagePath: (row.profile_image_path as string) ?? null,
    bannerImagePath: (row.banner_image_path as string) ?? null,
    cvPdfPath: (row.cv_pdf_path as string) ?? null,
    availabilityStatusId:
      (row.availability_status_id as string) ?? (status?.id as string) ?? "",
    availabilityStatusName: (status?.name as string) ?? "",
    professionalTitle: (row.professional_title as string) ?? "",
    subtitle: (row.subtitle as string) ?? "",
    about: (row.about as string) ?? "",
    metaTitle: (row.meta_title as string) ?? null,
    metaDescription: (row.meta_description as string) ?? null,
  };
}

async function fetchPerson(): Promise<Person | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("persons")
    .select(personSelect)
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
    .select(personSelect)
    .limit(1)
    .maybeSingle();
  return data;
}
