import { z } from "zod";

export const organizationSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Requerido"),
  typeId: z.string().uuid({ message: "Selecciona un tipo" }),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  logoPath: z.string().nullable().optional(),
  location: z.string(),
  description: z.string(),
});

export type OrganizationInput = z.infer<typeof organizationSchema>;
