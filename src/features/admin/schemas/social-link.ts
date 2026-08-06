import { z } from "zod";

export const socialLinkSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Requerido"),
  typeId: z.string().uuid({ message: "Selecciona un tipo" }),
  iconKey: z.string().min(1, "Requerido"),
  url: z.string().url().or(z.string().startsWith("mailto:")),
  sortOrder: z.coerce.number().int(),
  isVisible: z.boolean(),
});

export type SocialLinkInput = z.infer<typeof socialLinkSchema>;
