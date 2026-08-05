import { z } from "zod";

export const certificateSchema = z.object({
  id: z.string().uuid().optional(),
  organizationId: z.string().uuid({ message: "Selecciona una organización" }),
  issuedMonth: z.coerce.number().int().min(1).max(12),
  issuedYear: z.coerce.number().int().min(1950).max(2100),
  imagePath: z.string().nullable().optional(),
  pdfPath: z.string().nullable().optional(),
  credentialUrl: z.string().url().optional().or(z.literal("")),
  isFeatured: z.boolean(),
  sortOrder: z.coerce.number().int(),
  name: z.string().min(1, "Requerido"),
  description: z.string(),
});

export type CertificateInput = z.infer<typeof certificateSchema>;
