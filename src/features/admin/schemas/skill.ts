import { z } from "zod";
import { skillTypes } from "@/constants/skill-types";

export const skillSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Requerido"),
  type: z.enum(skillTypes),
  iconPath: z.string().nullable().optional(),
  sortOrder: z.coerce.number().int(),
  label: z.string(),
});

export type SkillInput = z.infer<typeof skillSchema>;
