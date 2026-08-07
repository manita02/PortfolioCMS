import Link from "next/link";
import { Reveal } from "@/components/shared/reveal";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export async function FinalCtaSection({
  githubUrl,
  email,
}: {
  githubUrl?: string | null;
  email?: string | null;
}) {
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
              Revisá mis proyectos o descargá el CV para conocer más detalles.
            </p>
            <div className="flex flex-wrap gap-3 pt-4">
              <Link
                href="/proyectos"
                className={cn(buttonVariants({ size: "lg" }))}
              >
                Ver proyectos
              </Link>
              <a
                href="/cv/pdf?download=1"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                )}
              >
                Descargar CV
              </a>
              {githubUrl ? (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "lg" }),
                  )}
                >
                  GitHub
                </a>
              ) : email ? (
                <a
                  href={`mailto:${email}`}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "lg" }),
                  )}
                >
                  Contactar
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
