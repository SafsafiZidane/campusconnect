import { z } from "zod";

export const UpdateProfileSchema = z.object({
  name: z.string().min(2, "Le nom doit comporter au moins 2 caractères."),
  speciality: z.string().min(2, "La spécialité est requise."),
  level: z.string().min(1, "Le niveau est requis."),
  skills: z.string().min(2, "Les compétences sont requises."),
  bio: z.string().optional(),
});

export type UpdateProfileFormData = z.infer<typeof UpdateProfileSchema>;
