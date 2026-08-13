import { CvDownloadButton } from "@/components/shared/cv-download-button";
import { Reveal } from "@/components/shared/reveal";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Person } from "@/types/domain";

export async function FinalCtaSection({ person }: { person: Person | null }) {
  return (
    <section
      id="cta"
      className="mx-auto w-full max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 sm:py-20"
    >
      <Reveal>
        <div className="from-muted/80 via-background to-accent/30 relative overflow-hidden rounded-[2rem] border border-border/60 bg-gradient-to-br px-6 py-12 sm:px-12 sm:py-16">
          <div className="relative max-w-2xl space-y-4">
            <h2 className="font-heading text-3xl tracking-tight sm:text-4xl">
              ¿Trabajamos juntos?
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed sm:text-lg">
              Estoy a disposición por cualquier consulta.
            </p>
            <div className="flex flex-wrap gap-3 pt-4">
              {person?.email ? (
                <a
                  href={`mailto:${person.email}`}
                  className={cn(buttonVariants({ size: "lg" }))}
                >
                  Contactar
                </a>
              ) : null}
              <CvDownloadButton variant="outline" size="lg" />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
