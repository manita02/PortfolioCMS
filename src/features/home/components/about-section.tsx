import { Sparkles } from "lucide-react";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeader } from "@/components/shared/section-header";
import { SocialLinks } from "@/components/shared/social-links";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Person, SocialLink } from "@/types/domain";

export async function AboutSection({
  title,
  person,
  socialLinks,
}: {
  title: string;
  person: Person | null;
  socialLinks: SocialLink[];
}) {
  if (!person?.about) return null;

  return (
    <section
      id="sobre-mi"
      className="mx-auto w-full max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 sm:py-20"
    >
      <Reveal>
        <SectionHeader title={title} id="about-heading" />
        <div className="space-y-6">
          <p className="text-muted-foreground text-base leading-relaxed whitespace-pre-line sm:text-lg">
            {person.about}
          </p>

          <div className="max-w-sm rounded-2xl border border-border/60 px-4 py-3">
            <p className="text-muted-foreground flex items-center gap-2 text-xs uppercase tracking-wide">
              <Sparkles className="size-3.5" aria-hidden />
              Disponibilidad
            </p>
            <p className="mt-1 text-sm font-medium">
              {person.availabilityStatusName}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <SocialLinks links={socialLinks} />
            {person.email ? (
              <a
                href={`mailto:${person.email}`}
                className={cn(buttonVariants({ size: "lg" }))}
              >
                Contactar
              </a>
            ) : null}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
