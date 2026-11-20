import { z } from "zod";

export const CreateReviewSchema = z.object({
  requestId: z.string().min(1, "Identifiant de demande requis."),
  rating: z.coerce.number().min(1, "La note minimale est 1 étoile.").max(5, "La note maximale est 5 étoiles."),
  comment: z.string().min(3, "Votre commentaire doit comporter au moins 3 caractères."),
});

export type CreateReviewFormData = z.infer<typeof CreateReviewSchema>;
