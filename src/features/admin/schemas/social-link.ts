import { z } from "zod";
import { socialLinkTypes } from "@/constants/social-link-types";

export const socialLinkSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Requerido"),
  type: z.enum(socialLinkTypes),
  iconKey: z.string().min(1, "Requerido"),
  url: z.string().url().or(z.string().startsWith("mailto:")),
  sortOrder: z.coerce.number().int(),
  isVisible: z.boolean(),
});

export type SocialLinkInput = z.infer<typeof socialLinkSchema>;
