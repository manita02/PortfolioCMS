"use server";

import type { StorageBucket } from "@/constants/storage-buckets";
import { storageBuckets } from "@/constants/storage-buckets";
import { isSafeStorageFolder } from "@/lib/auth/admin-policy";
import { requireAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

function assertBucket(bucket: string): asserts bucket is StorageBucket {
  if (!Object.values(storageBuckets).includes(bucket as StorageBucket)) {
    throw new Error("FORBIDDEN");
  }
}

export async function uploadFile(params: {
  bucket: StorageBucket;
  file: File;
  folder?: string;
}) {
  await requireAdmin();
  assertBucket(params.bucket);

  const folder = params.folder ?? "uploads";
  if (!isSafeStorageFolder(folder)) {
    throw new Error("FORBIDDEN");
  }

  const supabase = await createClient();
  const ext = params.file.name.split(".").pop()?.replace(/[^a-zA-Z0-9]/g, "") || "bin";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from(params.bucket)
    .upload(path, params.file, {
      cacheControl: "3600",
      upsert: false,
      contentType: params.file.type || undefined,
    });

  if (error) throw new Error("No se pudo subir el archivo.");
  return path;
}

export async function deleteFile(bucket: StorageBucket, path: string) {
  await requireAdmin();
  assertBucket(bucket);
  if (!path || path.includes("..") || path.startsWith("/")) {
    throw new Error("FORBIDDEN");
  }

  const supabase = await createClient();
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw new Error("No se pudo eliminar el archivo.");
}
