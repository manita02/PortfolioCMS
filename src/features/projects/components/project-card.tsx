"use client";

import Image from "next/image";
import Link from "next/link";
import { Code2, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { OrganizationBadge } from "@/components/shared/organization-badge";
import { storageBuckets } from "@/constants/storage-buckets";
import { formatProjectDateRange } from "@/lib/dates";
import { formatProjectDuration } from "@/lib/duration";
import { getPublicStorageUrl } from "@/lib/storage-url";
import type { Project } from "@/types/domain";

export function ProjectCard({
  project,
  seeLabel,
}: {
  project: Project;
  seeLabel: string;
}) {
  const image = getPublicStorageUrl(storageBuckets.projects, project.imagePath);
  const href = `/proyectos/${project.slug}`;
  const dateLabel = formatProjectDateRange(project);
  const duration =
    project.startMonth && project.startYear
      ? formatProjectDuration({
          startMonth: project.startMonth,
          startYear: project.startYear,
          endMonth: project.endMonth,
          endYear: project.endYear,
        })
      : "";

  return (
    <article className="group overflow-hidden rounded-2xl border border-border/70 bg-card/40 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-foreground/15 hover:shadow-md">
      <Link href={href} className="block">
        <div className="bg-muted relative aspect-[16/10] overflow-hidden">
          {image ? (
            <Image
              src={image}
              alt={project.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              sizes="(max-width:768px) 100vw, 33vw"
            />
          ) : (
            <div className="from-muted to-accent absolute inset-0 bg-gradient-to-br" />
          )}
          {project.isFeatured ? (
            <Badge className="absolute top-3 left-3" variant="secondary">
              <Star className="size-3" aria-hidden />
              Destacado
            </Badge>
          ) : null}
        </div>
      </Link>

      <div className="space-y-3 p-5">
        <Link href={href} className="block space-y-1">
          <h3 className="font-heading text-lg tracking-tight">{project.name}</h3>
          {dateLabel ? (
            <div className="text-muted-foreground">
              <p className="text-xs sm:text-sm">{dateLabel}</p>
              {duration ? (
                <p className="text-muted-foreground/80 text-[11px] tracking-wide sm:text-xs">
                  {duration}
                </p>
              ) : null}
            </div>
          ) : null}
        </Link>

        <OrganizationBadge organization={project.organization} size={36} />

        <Link href={href} className="block space-y-3">
          <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
            {project.summary || project.description}
          </p>
          {project.skills.length > 0 ? (
            <ul className="flex flex-wrap gap-1.5">
              {project.skills.slice(0, 4).map((skill) => (
                <li key={skill.id}>
                  <Badge variant="outline">{skill.label}</Badge>
                </li>
              ))}
            </ul>
          ) : null}
          <p className="text-sm font-medium underline-offset-4 group-hover:underline">
            {seeLabel}
          </p>
        </Link>
      </div>

      {project.githubUrl ? (
        <div className="border-t border-border/60 px-5 py-3">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
          >
            <Code2 className="size-3.5" aria-hidden />
            GitHub
          </a>
        </div>
      ) : null}
    </article>
  );
}
