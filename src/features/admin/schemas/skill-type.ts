import { z } from "zod";

export const skillTypeSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1, "Requerido"),
  sortOrder: z.coerce.number().int(),
});

export type SkillTypeInput = z.infer<typeof skillTypeSchema>;
