/** Modalidad de trabajo: Presencial / Híbrido / Remoto */
export const experienceTypes = ["onsite", "hybrid", "remote"] as const;

export type ExperienceType = (typeof experienceTypes)[number];

export const experienceTypeLabels: Record<
  ExperienceType,
  { es: string; en: string }
> = {
  onsite: { es: "Presencial", en: "On-site" },
  hybrid: { es: "Híbrido", en: "Hybrid" },
  remote: { es: "Remoto", en: "Remote" },
};
