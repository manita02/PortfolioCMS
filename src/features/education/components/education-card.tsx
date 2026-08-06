"use client";

import Image from "next/image";
import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { OrganizationBadge } from "@/components/shared/organization-badge";
import { useMediaViewer } from "@/components/shared/media-viewer";
import { storageBuckets } from "@/constants/storage-buckets";
import { formatDateRange } from "@/lib/dates";
import { getPublicStorageUrl } from "@/lib/storage-url";
import { cn } from "@/lib/utils";
import type { Education } from "@/types/domain";

export function EducationCard({
  item,
  presentLabel,
}: {
  item: Education;
  presentLabel: string;
}) {
  const { openMedia, viewer } = useMediaViewer();

  const diplomaImage = getPublicStorageUrl(
    storageBuckets.educations,
    item.diplomaImagePath,
  );
  const diplomaPdf = getPublicStorageUrl(
    storageBuckets.educations,
    item.diplomaPdfPath,
  );

  return (
    <article className="group space-y-3">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
        <h3 className="font-heading text-lg tracking-tight">{item.title}</h3>
        <p className="text-muted-foreground shrink-0 text-xs sm:text-sm">
          {formatDateRange({
            startMonth: item.startMonth,
            startYear: item.startYear,
            endMonth: item.endMonth,
            endYear: item.endYear,
            isCurrent: item.isCurrent,
            presentLabel,
          })}
        </p>
      </div>

      <OrganizationBadge
        organization={item.organization}
        meta={item.typeName}
      />

      {item.description ? (
        <p className="text-sm leading-relaxed whitespace-pre-line">
          {item.description}
        </p>
      ) : null}

      {diplomaImage ? (
        <button
          type="button"
          onClick={() =>
            openMedia(diplomaImage, {
              type: "image",
              title: `Diploma: ${item.title}`,
            })
          }
          className={cn(
            "bg-muted relative block aspect-[16/10] w-full max-w-sm overflow-hidden rounded-xl border border-border/60",
            "cursor-pointer transition-all duration-200",
            "hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-md",
            "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
          )}
          aria-label={`Ver imagen del diploma: ${item.title}`}
        >
          <Image
            src={diplomaImage}
            alt={`Diploma: ${item.title}`}
            fill
            className="object-cover"
            sizes="(max-width:768px) 100vw, 384px"
          />
        </button>
      ) : null}

      {diplomaPdf ? (
        <button
          type="button"
          onClick={() =>
            openMedia(diplomaPdf, {
              type: "pdf",
              title: `Diploma: ${item.title}`,
            })
          }
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          aria-label={`Ver PDF del diploma: ${item.title}`}
        >
          <FileText className="size-3.5" />
          Ver diploma
        </button>
      ) : null}

      {item.skills.length > 0 ? (
        <ul className="flex flex-wrap gap-1.5">
          {item.skills.map((skill) => (
            <li key={skill.id}>
              <Badge variant="outline">{skill.label}</Badge>
            </li>
          ))}
        </ul>
      ) : null}

      {viewer}
    </article>
  );
}
