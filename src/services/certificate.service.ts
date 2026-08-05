import { unstable_cache } from "next/cache";
import { cacheTags } from "@/lib/cache-tags";
import {
  createClient,
  createPublicClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import type { Certificate } from "@/types/domain";
import { mapCertificate } from "@/services/mappers";

const select = `
  *,
  organizations(*)
`;

async function fetchCertificates(options?: {
  featuredOnly?: boolean;
  limit?: number;
}): Promise<Certificate[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createPublicClient();
  let query = supabase
    .from("certificates")
    .select(select)
    .order("sort_order", { ascending: true })
    .order("issued_year", { ascending: false });

  if (options?.featuredOnly) query = query.eq("is_featured", true);
  if (options?.limit) query = query.limit(options.limit);

  const { data, error } = await query;
  if (error || !data) return [];
  return data.map((row) => mapCertificate(row as Record<string, unknown>));
}

export function getCertificates(options?: {
  featuredOnly?: boolean;
  limit?: number;
}) {
  return unstable_cache(
    () => fetchCertificates(options),
    [
      "certificates",
      String(options?.featuredOnly ?? false),
      String(options?.limit ?? "all"),
    ],
    { tags: [cacheTags.certificates] },
  )();
}

export async function getCertificatesRaw() {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("certificates")
    .select(select)
    .order("sort_order", { ascending: true });
  return (data ?? []) as import("@/features/admin/types/rows").CertificateAdminRow[];
}
