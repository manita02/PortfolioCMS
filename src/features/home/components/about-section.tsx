import { Sparkles } from "lucide-react";
import { OrgLogo } from "@/components/shared/org-logo";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeader } from "@/components/shared/section-header";
import { SocialLinks } from "@/components/shared/social-links";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Person, SocialLink } from "@/types/domain";

function AvailabilityBadge({ person }: { person: Person }) {
  const currentRole =
    person.currentlyWorking &&
    person.currentExperience?.title &&
    person.currentExperience.organization
      ? person.currentExperience
      : null;
  const organization = currentRole?.organization;
  const label = person.availabilityLabel.trim() || "Disponibilidad";
  const text = person.availabilityText.trim();

  if (currentRole && organization) {
    const href = organization.websiteUrl?.trim() || null;
    const body = (
      <>
        <OrgLogo
          logoPath={organization.logoPath}
          name={organization.name}
          size={32}
        />
        <p className="min-w-0 leading-snug break-words">
          <span className="font-heading text-foreground text-[0.95rem] tracking-tight">
            {currentRole.title}
          </span>
          <span className="text-muted-foreground"> en </span>
          <span className="text-foreground font-semibold tracking-tight">
            {organization.name}
          </span>
        </p>
      </>
    );

    return (
      <div className="max-w-sm rounded-2xl border border-border/60 px-4 py-3">
        <p className="text-muted-foreground flex items-center gap-2 text-xs uppercase tracking-wide">
          <Sparkles className="size-3.5" aria-hidden />
          Actualmente...
        </p>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${organization.name} (sitio web)`}
            className="focus-visible:ring-ring mt-1 flex min-w-0 items-center gap-2.5 rounded-lg focus-visible:ring-2 focus-visible:outline-none"
          >
            {body}
          </a>
        ) : (
          <div className="mt-1 flex min-w-0 items-center gap-2.5">{body}</div>
        )}
      </div>
    );
  }

  if (!text) return null;

  return (
    <div className="max-w-sm rounded-2xl border border-border/60 px-4 py-3">
      <p className="text-muted-foreground flex items-center gap-2 text-xs uppercase tracking-wide">
        <Sparkles className="size-3.5" aria-hidden />
        {label}
      </p>
      <p className="mt-1 text-sm font-medium">{text}</p>
    </div>
  );
}

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

          <AvailabilityBadge person={person} />

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
