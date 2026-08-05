import { z } from "zod";

export const projectSchema = z.object({
  id: z.string().uuid().optional(),
  organizationId: z.string().uuid().nullable().optional(),
  slug: z.string().optional(),
  name: z.string().min(1, "Requerido"),
  summary: z.string(),
  description: z.string(),
  startMonth: z.coerce.number().int().min(1).max(12).nullish(),
  startYear: z.coerce.number().int().min(1950).max(2100).nullish(),
  endMonth: z.coerce.number().int().min(1).max(12).nullish(),
  endYear: z.coerce.number().int().min(1950).max(2100).nullish(),
  imagePath: z.string().nullable().optional(),
  githubUrl: z.string().url().optional().or(z.literal("")),
  liveUrl: z.string().url().optional().or(z.literal("")),
  isFeatured: z.boolean(),
  sortOrder: z.coerce.number().int(),
  skillIds: z.array(z.string().uuid()),
});

export type ProjectInput = z.infer<typeof projectSchema>;
