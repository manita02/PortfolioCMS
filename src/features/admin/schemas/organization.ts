import { z } from "zod";
import { organizationTypes } from "@/constants/organization-types";

export const organizationSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Requerido"),
  type: z.enum(organizationTypes),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  logoPath: z.string().nullable().optional(),
  location: z.string(),
  description: z.string(),
});

export type OrganizationInput = z.infer<typeof organizationSchema>;
