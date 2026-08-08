import Image from "next/image";
import { Building2 } from "lucide-react";
import { storageBuckets } from "@/constants/storage-buckets";
import { getPublicStorageUrl } from "@/lib/storage-url";
import { cn } from "@/lib/utils";

export function OrgLogo({
  logoPath,
  name,
  className,
  size = 40,
}: {
  logoPath?: string | null;
  name?: string | null;
  className?: string;
  size?: number;
}) {
  const src = getPublicStorageUrl(storageBuckets.organizations, logoPath);

  return (
    <div
      className={cn(
        "bg-muted relative shrink-0 overflow-hidden rounded-xl border border-border/60",
        className,
      )}
      style={{ width: size, height: size }}
    >
      {src ? (
        <Image
          src={src}
          alt={name ? `Logo ${name}` : "Logo"}
          fill
          className="object-contain p-1"
          sizes={`${size}px`}
        />
      ) : (
        <div className="text-muted-foreground flex size-full items-center justify-center">
          <Building2 className="size-4" aria-hidden />
        </div>
      )}
    </div>
  );
}
