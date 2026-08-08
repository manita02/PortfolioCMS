import { EducationSection } from "@/features/education/components/education-section";
import { buildMetadata } from "@/lib/seo";
import { getEducations } from "@/services/education.service";

export async function generateMetadata() {
  return buildMetadata({
    title: "Educación",
    description: "Formación académica, cursos y programas.",
    path: "/educacion",
  });
}

export default async function EducationPage() {
  const items = await getEducations();

  return (
    <div className="pt-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h1 className="font-heading text-3xl tracking-tight sm:text-4xl">
          Educación
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-sm sm:text-base">
          Formación académica, cursos y programas.
        </p>
      </div>
      <EducationSection
        title=""
        items={items}
        presentLabel="Actualidad"
        emptyLabel="Aún no hay contenido."
      />
    </div>
  );
}
