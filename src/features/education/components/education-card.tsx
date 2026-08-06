"use client";

import Image from "next/image";
import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { OrgLogo } from "@/components/shared/org-logo";
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
  const institutionImage = getPublicStorageUrl(
    storageBuckets.educations,
    item.institutionImagePath,
  );
  const typeLabel = item.typeName;

  return (
    <article className="group flex gap-4">
      <OrgLogo
        logoPath={item.organization?.logoPath}
        name={item.organization?.name}
        size={44}
      />
      <div className="min-w-0 flex-1 space-y-3">
        <div>
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
          <p className="text-muted-foreground mt-1 text-sm">
            {item.organization?.name}
            {item.organization?.location
              ? ` · ${item.organization.location}`
              : ""}
            {" · "}
            {typeLabel}
          </p>
        </div>

        {item.description ? (
          <p className="text-sm leading-relaxed whitespace-pre-line">
            {item.description}
          </p>
        ) : null}

        {(diplomaImage || institutionImage) && (
          <div className="bg-muted relative aspect-[16/10] max-w-sm overflow-hidden rounded-xl border border-border/60">
            <Image
              src={(diplomaImage || institutionImage)!}
              alt={`Diploma: ${item.title}`}
              fill
              className="object-cover"
              sizes="(max-width:768px) 100vw, 384px"
            />
          </div>
        )}

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
      </div>
    </article>
  );
}
