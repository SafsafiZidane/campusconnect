import { z } from "zod";

export const CreateHelpRequestSchema = z.object({
  title: z.string().min(5, "Le titre doit comporter au moins 5 caractères."),
  description: z.string().min(10, "La description doit comporter au moins 10 caractères."),
  subject: z.string().min(2, "La matière est obligatoire."),
  level: z.string().min(1, "Le niveau est obligatoire."),
  availability: z.string().min(2, "La disponibilité est obligatoire (ex: Mardi 14h-16h)."),
});

export const UpdateHelpRequestSchema = CreateHelpRequestSchema.partial().extend({
  requestId: z.string().uuid("Identifiant invalide."),
});

export const HelpRequestFilterSchema = z.object({
  subject: z.string().optional(),
  level: z.string().optional(),
  status: z.enum(["OPEN", "ACCEPTED", "COMPLETED", "TOUS"]).optional(),
  query: z.string().optional(),
});

export type CreateHelpRequestFormData = z.infer<typeof CreateHelpRequestSchema>;
