import { z } from "zod";

export const socialLinkSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Requerido"),
  typeId: z.string().uuid({ message: "Selecciona un tipo" }),
  iconImage: z.string().nullable().optional(),
  url: z
    .string()
    .min(1, "Requerido")
    .refine(
      (value) =>
        value.startsWith("mailto:") || z.string().url().safeParse(value).success,
      { message: "URL no válida" },
    ),
  sortOrder: z.coerce.number().int(),
});

export type SocialLinkInput = z.infer<typeof socialLinkSchema>;
