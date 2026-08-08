import { z } from "zod";

export const skillSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Requerido"),
  typeId: z.string().uuid({ message: "Selecciona un tipo" }),
  iconPath: z.string().nullable().optional(),
  destacada: z.boolean().default(false),
  label: z.string(),
});

export type SkillInput = z.infer<typeof skillSchema>;
