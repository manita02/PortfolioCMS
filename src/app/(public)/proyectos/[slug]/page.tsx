import Image from "next/image";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { OrganizationBadge } from "@/components/shared/organization-badge";
import { JsonLd } from "@/components/seo/json-ld";
import { storageBuckets } from "@/constants/storage-buckets";
import { siteConfig } from "@/config/site";
import { ProjectCard } from "@/features/projects/components/project-card";
import { formatProjectDateRange } from "@/lib/dates";
import { formatProjectDuration } from "@/lib/duration";
import { buildMetadata } from "@/lib/seo";
import { getPublicStorageUrl } from "@/lib/storage-url";
import { cn } from "@/lib/utils";
import {
  getProjectBySlug,
  getRelatedProjects,
} from "@/services/project.service";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  const image = getPublicStorageUrl(storageBuckets.projects, project.imagePath);
  return buildMetadata({
    title: project.name,
    description: project.summary || project.description,
    path: `/proyectos/${slug}`,
    image,
  });
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const related = await getRelatedProjects(project, 3);
  const image = getPublicStorageUrl(storageBuckets.projects, project.imagePath);
  const dateLabel = formatProjectDateRange(project);
  const duration =
    project.startMonth && project.startYear
      ? formatProjectDuration({
          startMonth: project.startMonth,
          startYear: project.startYear,
          endMonth: project.endMonth,
          endYear: project.endYear,
        })
      : "";

  return (
    <article className="mx-auto w-full max-w-4xl px-4 pt-24 pb-16 sm:px-6 sm:pb-20">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: project.name,
          description: project.description,
          url: `${siteConfig.getUrl()}/proyectos/${project.slug}`,
          image: image ?? undefined,
        }}
      />

      <Breadcrumb
        items={[
          { label: "Inicio", href: "/" },
          { label: "Proyectos", href: "/proyectos" },
          { label: project.name },
        ]}
      />

      <h1 className="font-heading text-3xl tracking-tight sm:text-5xl">
        {project.name}
      </h1>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <OrganizationBadge organization={project.organization} />
        {dateLabel ? (
          <div className="text-muted-foreground shrink-0 sm:text-right">
            <p className="text-xs sm:text-sm">{dateLabel}</p>
            {duration ? (
              <p className="text-muted-foreground/80 text-[11px] tracking-wide sm:text-xs">
                {duration}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      {image ? (
        <div className="bg-muted relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl">
          <Image
            src={image}
            alt={project.name}
            fill
            className="object-cover"
            sizes="(max-width:1024px) 100vw, 896px"
            priority
          />
        </div>
      ) : null}

      <p className="mt-8 text-base leading-relaxed whitespace-pre-line sm:text-lg">
        {project.description}
      </p>

      {project.skills.length > 0 ? (
        <div className="mt-8">
          <h2 className="font-heading text-lg">Tecnologías</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {project.skills.map((skill) => (
              <li key={skill.id}>
                <Badge variant="secondary">{skill.label}</Badge>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-8 flex flex-wrap gap-3">
        {project.githubUrl ? (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            GitHub
          </a>
        ) : null}
        {project.liveUrl ? (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants())}
          >
            Ver en vivo
          </a>
        ) : null}
      </div>

      {related.length > 0 ? (
        <section className="mt-16 border-t border-border/60 pt-12">
          <h2 className="font-heading mb-6 text-2xl tracking-tight">
            Proyectos relacionados
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <ProjectCard
                key={item.id}
                project={item}
                seeLabel="Ver proyecto"
              />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
