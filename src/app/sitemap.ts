import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getProjects } from "@/services/project.service";

const staticPaths = [
  "",
  "/proyectos",
  "/experiencia",
  "/educacion",
  "/certificados",
  "/cv",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.getUrl();
  const projects = await getProjects();

  const entries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${base}${path || "/"}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  for (const project of projects) {
    entries.push({
      url: `${base}/proyectos/${project.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  return entries;
}
