import { Badge } from "@/components/ui/badge";
import { OrgLogo } from "@/components/shared/org-logo";
import { experienceTypeLabels } from "@/constants/experience-types";
import { formatDateRange } from "@/lib/dates";
import type { Experience } from "@/types/domain";

export function ExperienceCard({
  item,
  presentLabel,
}: {
  item: Experience;
  presentLabel: string;
}) {
  const modality =
    experienceTypeLabels[item.type]?.es ?? item.type;

  return (
    <article className="group flex gap-4">
      <OrgLogo
        logoPath={item.organization?.logoPath}
        name={item.organization?.name}
        size={44}
      />
      <div className="min-w-0 flex-1">
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
          {modality}
        </p>
        {item.description ? (
          <p className="mt-3 text-sm leading-relaxed whitespace-pre-line">
            {item.description}
          </p>
        ) : null}
        {item.skills.length > 0 ? (
          <ul className="mt-3 flex flex-wrap gap-1.5">
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
