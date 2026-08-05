"use client";

import { useEffect, useState } from "react";
import { FileText, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { StorageBucket } from "@/constants/storage-buckets";
import { uploadAdminFile } from "@/features/admin/actions/upload";
import { getPublicStorageUrl } from "@/lib/storage-url";

type Props = {
  bucket: StorageBucket;
  value?: string | null;
  onChange: (path: string | null) => void;
  accept?: string;
  folder?: string;
  label?: string;
};

export function MediaUploader({
  bucket,
  value,
  onChange,
  accept = "image/*",
  folder,
  label = "Archivo",
}: Props) {
  const [loading, setLoading] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const isPdf = accept.includes("pdf");
  const remotePreview = getPublicStorageUrl(bucket, value);
  const preview = localPreview ?? remotePreview;

  useEffect(() => {
    return () => {
      if (localPreview?.startsWith("blob:")) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

  async function onFileChange(file: File | null) {
    if (!file) return;

    if (localPreview?.startsWith("blob:")) URL.revokeObjectURL(localPreview);
    const objectUrl = URL.createObjectURL(file);
    setLocalPreview(objectUrl);

    setLoading(true);
    try {
      const formData = new FormData();
      formData.set("file", file);
      formData.set("bucket", bucket);
      if (folder) formData.set("folder", folder);
      const path = await uploadAdminFile(formData);
      onChange(path);
      toast.success("Archivo subido");
    } catch (error) {
      setLocalPreview(null);
      toast.error(error instanceof Error ? error.message : "Error al subir");
    } finally {
      setLoading(false);
    }
  }

  function clear() {
    if (localPreview?.startsWith("blob:")) URL.revokeObjectURL(localPreview);
    setLocalPreview(null);
    onChange(null);
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">{label}</p>

      {preview ? (
        <div className="bg-muted relative max-w-sm overflow-hidden rounded-xl border shadow-sm">
          {isPdf || preview.toLowerCase().includes(".pdf") ? (
            <div className="flex items-center gap-3 p-4">
              <FileText className="text-muted-foreground size-8 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">PDF</p>
                <a
                  href={preview}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground text-xs underline-offset-4 hover:underline"
                >
                  Ver archivo
                </a>
              </div>
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt=""
              className="aspect-video w-full object-cover"
            />
          )}
        </div>
      ) : (
        <div className="bg-muted/40 text-muted-foreground flex aspect-video max-w-sm items-center justify-center rounded-xl border border-dashed text-xs">
          Sin archivo
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <Input
          type="file"
          accept={accept}
          disabled={loading}
          className="max-w-sm"
          onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
        />
        {(value || localPreview) && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={loading}
            onClick={clear}
          >
            <Trash2 className="size-3.5" />
            Quitar
          </Button>
        )}
      </div>
      {loading ? (
        <p className="text-muted-foreground text-xs">Subiendo…</p>
      ) : null}
    </div>
  );
}
