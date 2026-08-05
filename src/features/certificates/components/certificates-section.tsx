import { EmptyState } from "@/components/shared/empty-state";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeader } from "@/components/shared/section-header";
import { CertificateCard } from "@/features/certificates/components/certificate-card";
import type { Certificate } from "@/types/domain";

export function CertificatesSection({
  title,
  items,
  seeAllLabel,
  emptyLabel,
  summary = false,
}: {
  title: string;
  items: Certificate[];
  seeAllLabel?: string;
  emptyLabel: string;
  summary?: boolean;
}) {
  return (
    <section
      id="certificados"
      className="mx-auto w-full max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 sm:py-20"
    >
      <Reveal>
        <SectionHeader
          title={title}
          href={summary ? "/certificados" : undefined}
          linkLabel={summary ? seeAllLabel : undefined}
        />
        {items.length === 0 ? (
          <EmptyState message={emptyLabel} />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, index) => (
              <Reveal key={item.id} delay={Math.min(index * 0.05, 0.25)}>
                <CertificateCard item={item} />
              </Reveal>
            ))}
          </div>
        )}
      </Reveal>
    </section>
  );
}
