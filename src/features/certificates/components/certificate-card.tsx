"use client";

import Image from "next/image";
import { FileText, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { OrganizationBadge } from "@/components/shared/organization-badge";
import { storageBuckets } from "@/constants/storage-buckets";
import { formatMonthYear } from "@/lib/dates";
import { getPublicStorageUrl } from "@/lib/storage-url";
import { cn } from "@/lib/utils";
import type { Certificate } from "@/types/domain";

export function CertificateCard({ item }: { item: Certificate }) {
  const image = getPublicStorageUrl(
    storageBuckets.certificates,
    item.imagePath,
  );
  const pdf = getPublicStorageUrl(storageBuckets.certificates, item.pdfPath);

  return (
    <article className="group overflow-hidden rounded-2xl border border-border/70 bg-card/40 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="bg-muted relative aspect-[16/10]">
        {image ? (
          <Image
            src={image}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width:768px) 100vw, 33vw"
          />
        ) : (
          <div className="from-muted to-accent absolute inset-0 bg-gradient-to-br" />
        )}
        {item.isFeatured ? (
          <Badge className="absolute top-3 left-3" variant="secondary">
            Destacado
          </Badge>
        ) : null}
      </div>
      <div className="space-y-3 p-5">
        <div className="space-y-2">
          <h3 className="font-heading text-lg tracking-tight">{item.name}</h3>
          <OrganizationBadge organization={item.organization} size={36} />
          <p className="text-muted-foreground text-xs">
            {formatMonthYear(item.issuedMonth, item.issuedYear, "")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {pdf ? (
            <a
              href={pdf}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              <FileText className="size-3.5" />
              Abrir PDF
            </a>
          ) : null}
          {item.credentialUrl ? (
            <a
              href={item.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
            >
              <ExternalLink className="size-3.5" />
              Credencial
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
