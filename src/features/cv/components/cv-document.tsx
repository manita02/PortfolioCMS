import { formatDateRange } from "@/lib/dates";
import type { CvData } from "@/types/domain";

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

      {data.skills.length > 0 ? (
        <section className="mt-8">
          <h2 className="font-heading text-sm tracking-[0.14em] uppercase">
            {labels.skills}
          </h2>
          <p className="mt-3">{data.skills.map((s) => s.label).join(" · ")}</p>
        </section>
      ) : null}

      {data.experiences.length > 0 ? (
        <section className="mt-8">
          <h2 className="font-heading text-sm tracking-[0.14em] uppercase">
            {labels.experience}
          </h2>
          <div className="mt-4 space-y-5">
            {data.experiences.map((item) => (
              <div key={item.id}>
                <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                  <p className="font-medium">
                    {item.title}
                    {item.organization?.name
                      ? ` — ${item.organization.name}`
                      : ""}
                  </p>
                  <p className="text-muted-foreground text-sm">
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
                {item.description ? (
                  <p className="mt-2 whitespace-pre-line">{item.description}</p>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {data.educations.length > 0 ? (
        <section className="mt-8">
          <h2 className="font-heading text-sm tracking-[0.14em] uppercase">
            {labels.education}
          </h2>
          <div className="mt-4 space-y-5">
            {data.educations.map((item) => (
              <div key={item.id}>
                <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                  <p className="font-medium">
                    {item.title}
                    {item.organization?.name
                      ? ` — ${item.organization.name}`
                      : ""}
                  </p>
                  <p className="text-muted-foreground text-sm">
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
                {item.description ? (
                  <p className="mt-2 whitespace-pre-line">{item.description}</p>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {data.projects.length > 0 ? (
        <section className="mt-8">
          <h2 className="font-heading text-sm tracking-[0.14em] uppercase">
            {labels.projects}
          </h2>
          <div className="mt-4 space-y-4">
            {data.projects.map((item) => (
              <div key={item.id}>
                <p className="font-medium">{item.name}</p>
                <p className="mt-1 whitespace-pre-line">
                  {item.summary || item.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
