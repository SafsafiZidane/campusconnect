"use server";

import { revalidatePath } from "next/cache";
import { useCases } from "@/container";
import { getCurrentSession } from "@/lib/auth/session";
import { CreateReviewSchema } from "@/lib/schemas/review.schema";

export async function createReviewAction(formData: FormData) {
  const session = await getCurrentSession();
  if (!session) {
    return { ok: false as const, message: "Vous devez être connecté." };
  }

  const raw = {
    requestId: formData.get("requestId"),
    rating: formData.get("rating"),
    comment: formData.get("comment"),
  };

  const parsed = CreateReviewSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false as const,
      errors: parsed.error.flatten().fieldErrors,
      message: "Veuillez fournir une note (1 à 5) et un commentaire.",
    };
  }

  const result = await useCases.createSessionReview.execute({
    ...parsed.data,
    reviewerId: session.id,
  });

  if (!result.ok) {
    return { ok: false as const, message: result.message };
  }

  revalidatePath(`/requests/${parsed.data.requestId}`);
  revalidatePath("/dashboard");
  return { ok: true as const, reviewId: result.value.id };
}
