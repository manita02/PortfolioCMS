import { z } from "zod";

export const personSchema = z
  .object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email().optional().or(z.literal("")),
    availabilityLabel: z.string().trim().min(1, "Requerido"),
    availabilityText: z.string().trim().min(1, "Requerido"),
    currentlyWorking: z.boolean(),
    currentExperienceId: z.string().optional().or(z.literal("")),
    profileImagePath: z.string().nullable().optional(),
    bannerImagePath: z.string().nullable().optional(),
    professionalTitle: z.string().min(1),
    subtitle: z.string(),
    about: z.string(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.currentlyWorking) return;
    const id = data.currentExperienceId?.trim() ?? "";
    if (!z.string().uuid().safeParse(id).success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["currentExperienceId"],
        message: "Selecciona el puesto actual",
      });
    }
  });

export type PersonInput = z.infer<typeof personSchema>;
