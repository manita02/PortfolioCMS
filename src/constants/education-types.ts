export const educationTypes = [
  "degree",
  "course",
  "bootcamp",
  "certification_program",
  "other",
] as const;

export type EducationType = (typeof educationTypes)[number];
