"use server";

import type { StorageBucket } from "@/constants/storage-buckets";
import { storageBuckets } from "@/constants/storage-buckets";
import { requireAdmin } from "@/lib/supabase/admin";
import { uploadFile } from "@/services/storage.service";

export async function uploadAdminFile(formData: FormData) {
  await requireAdmin();

  const file = formData.get("file");
  const bucket = String(formData.get("bucket") ?? "") as StorageBucket;
  const folder = String(formData.get("folder") ?? "uploads");

  if (!(file instanceof File)) {
    throw new Error("El archivo es obligatorio");
  }

  if (!Object.values(storageBuckets).includes(bucket)) {
    throw new Error("Bucket no válido");
  }

  return uploadFile({ bucket, file, folder });
}
