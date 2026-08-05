"use server";

import type { StorageBucket } from "@/constants/storage-buckets";
import { storageBuckets } from "@/constants/storage-buckets";
import { uploadFile } from "@/services/storage.service";

export async function uploadAdminFile(formData: FormData) {
  const file = formData.get("file");
  const bucket = String(formData.get("bucket") ?? "") as StorageBucket;
  const folder = String(formData.get("folder") ?? "uploads");

  if (!(file instanceof File)) {
    throw new Error("File is required");
  }

  if (!Object.values(storageBuckets).includes(bucket)) {
    throw new Error("Invalid bucket");
  }

  return uploadFile({ bucket, file, folder });
}
