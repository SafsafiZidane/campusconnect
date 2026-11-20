"use server";

import { revalidatePath } from "next/cache";
import { useCases } from "@/container";
import { getCurrentSession } from "@/lib/auth/session";
import { CreateHelpRequestSchema, UpdateHelpRequestSchema } from "@/lib/schemas/help-request.schema";

export async function createHelpRequestAction(formData: FormData) {
  const session = await getCurrentSession();
  if (!session) {
    return { ok: false as const, message: "Vous devez être connecté pour publier une demande." };
  }

  const raw = {
    title: formData.get("title"),
    description: formData.get("description"),
    subject: formData.get("subject"),
    level: formData.get("level"),
    availability: formData.get("availability"),
  };

  const parsed = CreateHelpRequestSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false as const,
      errors: parsed.error.flatten().fieldErrors,
      message: "Formulaire invalide, veuillez corriger les erreurs.",
    };
  }

  const result = await useCases.createHelpRequest.execute({
    ...parsed.data,
    authorId: session.id,
  });

  if (!result.ok) {
    return { ok: false as const, message: result.message };
  }

  revalidatePath("/requests");
  revalidatePath("/dashboard");
  return { ok: true as const, requestId: result.value.id };
}

export async function updateHelpRequestAction(formData: FormData) {
  const session = await getCurrentSession();
  if (!session) {
    return { ok: false as const, message: "Vous devez être connecté." };
  }

  const raw = {
    requestId: formData.get("requestId"),
    title: formData.get("title") || undefined,
    description: formData.get("description") || undefined,
    subject: formData.get("subject") || undefined,
    level: formData.get("level") || undefined,
    availability: formData.get("availability") || undefined,
  };

  const parsed = UpdateHelpRequestSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false as const,
      errors: parsed.error.flatten().fieldErrors,
      message: "Données de modification invalides.",
    };
  }

  const result = await useCases.updateHelpRequest.execute({
    ...parsed.data,
    userId: session.id,
  });

  if (!result.ok) {
    return { ok: false as const, message: result.message };
  }

  revalidatePath(`/requests/${parsed.data.requestId}`);
  revalidatePath("/requests");
  revalidatePath("/dashboard");
  return { ok: true as const, requestId: result.value.id };
}

export async function completeSessionAction(requestId: string) {
  const session = await getCurrentSession();
  if (!session) {
    return { ok: false as const, message: "Vous devez être connecté." };
  }

  const result = await useCases.completeHelpRequest.execute(requestId, session.id);
  if (!result.ok) {
    return { ok: false as const, message: result.message };
  }

  revalidatePath(`/requests/${requestId}`);
  revalidatePath("/dashboard");
  return { ok: true as const };
}
