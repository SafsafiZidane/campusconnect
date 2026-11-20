import { z } from "zod";

export const SubmitProposalSchema = z.object({
  requestId: z.string().min(1, "Identifiant de demande requis."),
  message: z.string().min(5, "Votre message de proposition doit comporter au moins 5 caractères."),
  proposedAvailability: z.string().optional(),
});

export type SubmitProposalFormData = z.infer<typeof SubmitProposalSchema>;
