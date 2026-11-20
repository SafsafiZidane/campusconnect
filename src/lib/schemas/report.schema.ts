import { z } from "zod";

export const CreateReportSchema = z.object({
  requestId: z.string().min(1, "Identifiant de demande requis."),
  reason: z.string().min(5, "Le motif du signalement doit comporter au moins 5 caractères."),
  details: z.string().optional(),
});

export type CreateReportFormData = z.infer<typeof CreateReportSchema>;
