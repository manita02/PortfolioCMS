"use server";

import { revalidateTag } from "next/cache";
import {
  certificateSchema,
  type CertificateInput,
} from "@/features/admin/schemas/certificate";
import { cacheTags } from "@/lib/cache-tags";
import { requireAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function upsertCertificateAction(input: CertificateInput) {
  await requireAdmin();
  const data = certificateSchema.parse(input);
  const supabase = await createClient();

  const payload = {
    organization_id: data.organizationId,
    issued_month: data.issuedMonth,
    issued_year: data.issuedYear,
    image_path: data.imagePath ?? null,
    pdf_path: data.pdfPath ?? null,
    credential_url: data.credentialUrl || null,
    is_featured: data.isFeatured,
    sort_order: data.sortOrder,
    name: data.name,
    description: data.description,
  };

  let id = data.id;
  if (id) {
    const { error } = await supabase
      .from("certificates")
      .update(payload)
      .eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { data: created, error } = await supabase
      .from("certificates")
      .insert(payload)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    id = created.id;
  }

  revalidateTag(cacheTags.certificates);
  revalidateTag(cacheTags.cv);
}

export async function deleteCertificateAction(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("certificates").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateTag(cacheTags.certificates);
  revalidateTag(cacheTags.cv);
}
