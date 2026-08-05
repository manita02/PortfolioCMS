export const organizationTypes = [
  "company",
  "university",
  "school",
  "community",
  "other",
] as const;

export type OrganizationType = (typeof organizationTypes)[number];
