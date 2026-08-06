"use client";

import Image from "next/image";
import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { OrganizationBadge } from "@/components/shared/organization-badge";
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
        <div className="bg-muted relative aspect-[16/10] max-w-sm overflow-hidden rounded-xl border border-border/60">
          <Image
            src={diplomaImage}
            alt={`Diploma: ${item.title}`}
            fill
            className="object-cover"
            sizes="(max-width:768px) 100vw, 384px"
          />
        </div>
      ) : null}

      {diplomaPdf ? (
        <a
          href={diplomaPdf}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          <FileText className="size-3.5" />
          Abrir diploma
        </a>
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
    </article>
  );
}
