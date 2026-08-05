import { ExperienceSection } from "@/features/experiences/components/experience-section";
import { buildMetadata } from "@/lib/seo";
import { getExperiences } from "@/services/experience.service";

export async function generateMetadata() {
  return buildMetadata({
    title: "Experiencia",
    description: "Trayectoria profesional y roles relevantes.",
    path: "/experiencia",
  });
}

export default async function ExperiencePage() {
  const items = await getExperiences();

  return (
    <div className="pt-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h1 className="font-heading text-3xl tracking-tight sm:text-4xl">
          Experiencia
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-sm sm:text-base">
          Trayectoria profesional y roles relevantes.
        </p>
      </div>
      <ExperienceSection
        title=""
        items={items}
        presentLabel="Actualidad"
        emptyLabel="Aún no hay contenido."
      />
    </div>
  );
}
