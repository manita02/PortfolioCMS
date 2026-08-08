import { EmptyState } from "@/components/shared/empty-state";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeader } from "@/components/shared/section-header";
import { Timeline, TimelineItem } from "@/components/shared/timeline";
import { ExperienceCard } from "@/features/experiences/components/experience-card";
import type { Experience } from "@/types/domain";

export function ExperienceSection({
  title,
  items,
  presentLabel,
  seeAllLabel,
  emptyLabel,
  summary = false,
}: {
  title: string;
  items: Experience[];
  presentLabel: string;
  seeAllLabel?: string;
  emptyLabel: string;
  summary?: boolean;
}) {
  return (
    <section
      id="experiencia"
      className="mx-auto w-full max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 sm:py-20"
    >
      <Reveal>
        <SectionHeader
          title={title}
          href={summary ? "/experiencia" : undefined}
          linkLabel={summary ? seeAllLabel : undefined}
        />
        {items.length === 0 ? (
          <EmptyState message={emptyLabel} />
        ) : (
          <Timeline>
            {items.map((item, index) => (
              <TimelineItem key={item.id}>
                <Reveal delay={Math.min(index * 0.04, 0.2)}>
                  <ExperienceCard item={item} presentLabel={presentLabel} />
                </Reveal>
              </TimelineItem>
            ))}
          </Timeline>
        )}
      </Reveal>
    </section>
  );
}
