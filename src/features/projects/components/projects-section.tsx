import { EmptyState } from "@/components/shared/empty-state";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeader } from "@/components/shared/section-header";
import { ProjectCard } from "@/features/projects/components/project-card";
import type { Project } from "@/types/domain";

export function ProjectsSection({
  title,
  items,
  seeAllLabel,
  seeLabel,
  emptyLabel,
  summary = false,
}: {
  title: string;
  items: Project[];
  seeAllLabel?: string;
  seeLabel: string;
  emptyLabel: string;
  summary?: boolean;
}) {
  return (
    <section
      id="proyectos"
      className="mx-auto w-full max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 sm:py-20"
    >
      <Reveal>
        <SectionHeader
          title={title}
          href={summary ? "/proyectos" : undefined}
          linkLabel={summary ? seeAllLabel : undefined}
        />
        {items.length === 0 ? (
          <EmptyState message={emptyLabel} />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((project, index) => (
              <Reveal key={project.id} delay={Math.min(index * 0.05, 0.25)}>
                <ProjectCard project={project} seeLabel={seeLabel} />
              </Reveal>
            ))}
          </div>
        )}
      </Reveal>
    </section>
  );
}
