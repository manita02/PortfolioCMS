import { EmptyState } from "@/components/shared/empty-state";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeader } from "@/components/shared/section-header";
import { Timeline, TimelineItem } from "@/components/shared/timeline";
import { EducationCard } from "@/features/education/components/education-card";
import type { Education } from "@/types/domain";

export function EducationSection({
  title,
  items,
  presentLabel,
  seeAllLabel,
  emptyLabel,
  summary = false,
}: {
  title: string;
  items: Education[];
  presentLabel: string;
  seeAllLabel?: string;
  emptyLabel: string;
  summary?: boolean;
}) {
  return (
    <section
      id="educacion"
      className="mx-auto w-full max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 sm:py-20"
    >
      <Reveal>
        <SectionHeader
          title={title}
          href={summary ? "/educacion" : undefined}
          linkLabel={summary ? seeAllLabel : undefined}
        />
        {items.length === 0 ? (
          <EmptyState message={emptyLabel} />
        ) : (
          <Timeline>
            {items.map((item, index) => (
              <TimelineItem key={item.id}>
                <Reveal delay={Math.min(index * 0.04, 0.2)}>
                  <EducationCard item={item} presentLabel={presentLabel} />
                </Reveal>
              </TimelineItem>
            ))}
          </Timeline>
        )}
      </Reveal>
    </section>
  );
}
