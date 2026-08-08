import { educationTypeIds, skillTypeIds } from "@/constants/catalog-ids";
import { formatDateRange, formatProjectDateRange } from "@/lib/dates";
import type { CvData, Skill } from "@/types/domain";

function skillNames(skills: Skill[]) {
  return skills.map((s) => s.label || s.name).filter(Boolean).join(", ");
}

function groupSkillsByType(skills: Skill[]) {
  const byType = new Map<
    string,
    { typeName: string; typeSortOrder: number; names: string[] }
  >();

  for (const skill of skills) {
    if (skill.typeId === skillTypeIds.hidden) continue;
    const name = skill.label || skill.name;
    if (!name) continue;
    const existing = byType.get(skill.typeId);
    if (existing) {
      existing.names.push(name);
    } else {
      byType.set(skill.typeId, {
        typeName: skill.typeName,
        typeSortOrder: skill.typeSortOrder,
        names: [name],
      });
    }
  }

  return [...byType.values()].sort(
    (a, b) =>
      a.typeSortOrder - b.typeSortOrder || a.typeName.localeCompare(b.typeName),
  );
}

const exportableEducationTypeIds = new Set<string>([
  educationTypeIds.career,
  educationTypeIds.certificationProgram,
]);

export function CvDocument({
  data,
  presentLabel,
  labels,
}: {
  data: CvData;
  presentLabel: string;
  labels: {
    summary: string;
    contact: string;
    experience: string;
    education: string;
    skills: string;
    projects: string;
  };
}) {
  const person = data.person;
  const name = person
    ? `${person.firstName} ${person.lastName}`
    : "Curriculum Vitae";

  const skillGroups = groupSkillsByType(data.skills);
  const educations = data.educations.filter((item) =>
    exportableEducationTypeIds.has(item.typeId),
  );
  const projects = data.projects.filter((item) => item.isFeatured);

  return (
    <div className="cv-document mx-auto max-w-3xl bg-background px-4 py-10 text-[15px] leading-relaxed sm:px-8 print:max-w-none print:px-0 print:py-0">
      <header className="border-b border-border pb-6">
        <h1 className="font-heading text-3xl tracking-tight">{name}</h1>
        {person?.professionalTitle ? (
          <p className="mt-1 text-lg">{person.professionalTitle}</p>
        ) : null}
        <div className="text-muted-foreground mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
          {person?.email ? <span>{person.email}</span> : null}
          {data.socialLinks.map((link) => (
            <a key={link.id} href={link.url} className="hover:underline">
              {link.name}
            </a>
          ))}
        </div>
      </header>

      {person?.about ? (
        <section className="mt-8">
          <h2 className="font-heading text-sm tracking-[0.14em] uppercase">
            {labels.summary}
          </h2>
          <p className="mt-3 whitespace-pre-line">{person.about}</p>
        </section>
      ) : null}

      {skillGroups.length > 0 ? (
        <section className="mt-8">
          <h2 className="font-heading text-sm tracking-[0.14em] uppercase">
            {labels.skills}
          </h2>
          <div className="mt-3 space-y-1">
            {skillGroups.map((group) => (
              <p key={group.typeName}>
                {group.typeName}: {group.names.join(", ")}
              </p>
            ))}
          </div>
        </section>
      ) : null}

      {data.experiences.length > 0 ? (
        <section className="mt-8">
          <h2 className="font-heading text-sm tracking-[0.14em] uppercase">
            {labels.experience}
          </h2>
          <div className="mt-4 space-y-5">
            {data.experiences.map((item) => {
              const technologies = skillNames(item.skills);
              const meta = [
                item.typeName,
                item.modalityName,
                formatDateRange({
                  startMonth: item.startMonth,
                  startYear: item.startYear,
                  endMonth: item.endMonth,
                  endYear: item.endYear,
                  isCurrent: item.isCurrent,
                  presentLabel,
                }),
              ]
                .filter(Boolean)
                .join(" · ");

              return (
                <div key={item.id}>
                  <p className="font-medium">
                    {item.title}
                    {item.organization?.name
                      ? ` — ${item.organization.name}`
                      : ""}
                    {meta ? (
                      <span className="text-muted-foreground text-sm font-normal">
                        {` | ${meta}`}
                      </span>
                    ) : null}
                  </p>
                  {item.description ? (
                    <p className="mt-2 whitespace-pre-line">{item.description}</p>
                  ) : null}
                  {technologies ? (
                    <p className="text-muted-foreground mt-1 text-sm">
                      Tecnologías: {technologies}
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      {educations.length > 0 ? (
        <section className="mt-8">
          <h2 className="font-heading text-sm tracking-[0.14em] uppercase">
            {labels.education}
          </h2>
          <div className="mt-4 space-y-5">
            {educations.map((item) => {
              const technologies = skillNames(item.skills);
              const meta = [
                item.typeName,
                formatDateRange({
                  startMonth: item.startMonth,
                  startYear: item.startYear,
                  endMonth: item.endMonth,
                  endYear: item.endYear,
                  isCurrent: item.isCurrent,
                  presentLabel,
                }),
              ]
                .filter(Boolean)
                .join(" · ");

              return (
                <div key={item.id}>
                  <p className="font-medium">
                    {item.title}
                    {item.organization?.name
                      ? ` — ${item.organization.name}`
                      : ""}
                    {meta ? (
                      <span className="text-muted-foreground text-sm font-normal">
                        {` | ${meta}`}
                      </span>
                    ) : null}
                  </p>
                  {item.description ? (
                    <p className="mt-2 whitespace-pre-line">{item.description}</p>
                  ) : null}
                  {technologies ? (
                    <p className="text-muted-foreground mt-1 text-sm">
                      Tecnologías: {technologies}
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      {projects.length > 0 ? (
        <section className="mt-8">
          <h2 className="font-heading text-sm tracking-[0.14em] uppercase">
            {labels.projects}
          </h2>
          <div className="mt-4 space-y-4">
            {projects.map((item) => {
              const technologies = skillNames(item.skills);
              const url = item.liveUrl || item.githubUrl;
              const dates = formatProjectDateRange({
                startMonth: item.startMonth,
                startYear: item.startYear,
                endMonth: item.endMonth,
                endYear: item.endYear,
              });

              return (
                <div key={item.id}>
                  <p className="font-medium">
                    {item.name}
                    {dates ? (
                      <span className="text-muted-foreground text-sm font-normal">
                        {` | ${dates}`}
                      </span>
                    ) : null}
                  </p>
                  {item.description ? (
                    <p className="mt-1 whitespace-pre-line">{item.description}</p>
                  ) : null}
                  {technologies || url ? (
                    <p className="text-muted-foreground mt-1 text-sm">
                      {technologies ? `Tecnologías: ${technologies}` : null}
                      {technologies && url ? " | " : null}
                      {url ? (
                        <a href={url} className="hover:underline">
                          {url}
                        </a>
                      ) : null}
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>
      ) : null}
    </div>
  );
}
