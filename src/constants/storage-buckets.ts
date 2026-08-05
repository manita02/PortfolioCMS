export const storageBuckets = {
  person: "person",
  projects: "projects",
  organizations: "organizations",
  educations: "educations",
  certificates: "certificates",
  cv: "cv",
  icons: "icons",
} as const;

export type StorageBucket = (typeof storageBuckets)[keyof typeof storageBuckets];
