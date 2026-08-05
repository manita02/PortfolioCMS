export const cacheTags = {
  person: "person",
  organizations: "organizations",
  experiences: "experiences",
  education: "education",
  projects: "projects",
  project: (slug: string) => `project:${slug}`,
  skills: "skills",
  certificates: "certificates",
  socialLinks: "social-links",
  cv: "cv",
} as const;
