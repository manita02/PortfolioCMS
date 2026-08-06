import { Badge } from "@/components/ui/badge";
import { OrganizationBadge } from "@/components/shared/organization-badge";
import { formatDateRange } from "@/lib/dates";
import type { Experience } from "@/types/domain";

export function ExperienceCard({
  item,
  presentLabel,
}: {
  item: Experience;
  presentLabel: string;
}) {
  return (
    <article className="group space-y-3">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
          <h3 className="font-heading text-lg tracking-tight">{item.title}</h3>
          {item.typeName ? (
            <Badge
              variant="secondary"
              className="max-w-full shrink-0 truncate font-normal"
            >
              {item.typeName}
            </Badge>
          ) : null}
        </div>
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
        meta={item.modalityName}
      />

      {item.description ? (
        <p className="text-sm leading-relaxed whitespace-pre-line">
          {item.description}
        </p>
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
