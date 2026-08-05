"use server";

import type { StorageBucket } from "@/constants/storage-buckets";
import { requireAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function uploadFile(params: {
  bucket: StorageBucket;
  file: File;
  folder?: string;
}) {
  await requireAdmin();
  const supabase = await createClient();
  const ext = params.file.name.split(".").pop() ?? "bin";
  const path = `${params.folder ?? "uploads"}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from(params.bucket)
    .upload(path, params.file, {
      cacheControl: "3600",
      upsert: false,
      contentType: params.file.type || undefined,
    });

  if (error) throw new Error(error.message);
  return path;
}

export async function deleteFile(bucket: StorageBucket, path: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw new Error(error.message);
}
