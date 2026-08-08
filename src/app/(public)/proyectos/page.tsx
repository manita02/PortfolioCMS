import { ProjectsBrowser } from "@/features/projects/components/projects-browser";
import { buildMetadata } from "@/lib/seo";
import { getProjects } from "@/services/project.service";
import { getSkillsUsedByProjects } from "@/services/skill.service";

export async function generateMetadata() {
  return buildMetadata({
    title: "Proyectos",
    description: "Selección de proyectos y trabajos destacados.",
    path: "/proyectos",
  });
}

export default async function ProjectsPage() {
  const [projects, skills] = await Promise.all([
    getProjects(),
    getSkillsUsedByProjects(),
  ]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pt-24 pb-16 sm:px-6 sm:pb-20">
      <header className="mb-10 space-y-2">
        <h1 className="font-heading text-3xl tracking-tight sm:text-4xl">
          Proyectos
        </h1>
        <p className="text-muted-foreground max-w-2xl text-sm sm:text-base">
          Selección de proyectos y trabajos destacados.
        </p>
      </header>
      <ProjectsBrowser
        projects={projects}
        skills={skills}
        seeLabel="Ver proyecto"
      />
    </div>
  );
}
