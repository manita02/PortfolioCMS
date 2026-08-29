import { unstable_cache } from "next/cache";
import { cacheTags } from "@/lib/cache-tags";
import {
  createClient,
  createPublicClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import { mapOrganization } from "@/services/mappers";
import type { Person } from "@/types/domain";

const personSelect = `
  *,
  current_experience:experiences!persons_current_experience_id_fkey (
    id,
    title,
    organization_id,
    organizations (
      *,
      organization_types ( id, name, sort_order )
    )
  )
`;

function mapCurrentExperience(
  row: Record<string, unknown> | null | undefined,
): Person["currentExperience"] {
  if (!row?.id) return null;

  return {
    id: row.id as string,
    title: (row.title as string) ?? "",
    organization: mapOrganization(
      row.organizations as Record<string, unknown>,
    ),
  };
}

function mapPerson(row: Record<string, unknown>): Person {
  const nested = (row.current_experience ?? row.experiences) as
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
    availabilityLabel: (row.availability_label as string) ?? "Disponibilidad",
    availabilityText: (row.availability_text as string) ?? "",
    currentlyWorking: Boolean(row.currently_working),
    currentExperienceId: (row.current_experience_id as string) ?? null,
    currentExperience: mapCurrentExperience(nested),
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
    .select("*")
    .limit(1)
    .maybeSingle();
  return data;
}
