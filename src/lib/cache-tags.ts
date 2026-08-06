export const cacheTags = {
  catalogs: "catalogs",
  person: "person",
  organizations: "organizations",
  experiences: "experiences",
  education: "education",
  projects: "projects",
  project: (slug: string) => `project:${slug}`,
  skills: "skills",
  socialLinks: "social-links",
  cv: "cv",
} as const;
