import { z } from "zod";
import { availabilityStatuses } from "@/constants/availability";

export const personSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email().optional().or(z.literal("")),
  availabilityStatus: z.enum(availabilityStatuses),
  profileImagePath: z.string().nullable().optional(),
  bannerImagePath: z.string().nullable().optional(),
  cvPdfPath: z.string().nullable().optional(),
  professionalTitle: z.string().min(1),
  subtitle: z.string(),
  about: z.string(),
  availabilityLabel: z.string(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

export type PersonInput = z.infer<typeof personSchema>;
