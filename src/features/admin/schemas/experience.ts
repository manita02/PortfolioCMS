import { z } from "zod";

export const experienceSchema = z.object({
  id: z.string().uuid().optional(),
  organizationId: z.string().uuid({ message: "Selecciona una organización" }),
  typeId: z.string().uuid({ message: "Selecciona un tipo de experiencia" }),
  modalityId: z.string().uuid({ message: "Selecciona una modalidad" }),
  startMonth: z.coerce.number().int().min(1).max(12),
  startYear: z.coerce.number().int().min(1950).max(2100),
  endMonth: z.coerce.number().int().min(1).max(12).nullish(),
  endYear: z.coerce.number().int().min(1950).max(2100).nullish(),
  isCurrent: z.boolean(),
  sortOrder: z.coerce.number().int(),
  skillIds: z.array(z.string().uuid()),
  title: z.string().min(1, "Requerido"),
  description: z.string(),
});

export type ExperienceInput = z.infer<typeof experienceSchema>;
