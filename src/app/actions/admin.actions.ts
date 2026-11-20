"use server";

import { revalidatePath } from "next/cache";
import { useCases } from "@/container";
import { getCurrentSession } from "@/lib/auth/session";
import { CreateReportSchema } from "@/lib/schemas/report.schema";

export async function reportPublicationAction(formData: FormData) {
  const session = await getCurrentSession();
  if (!session) {
    return { ok: false as const, message: "Vous devez être connecté pour signaler une publication." };
  }

  const raw = {
    requestId: formData.get("requestId"),
    reason: formData.get("reason"),
    details: formData.get("details") || undefined,
  };

  const parsed = CreateReportSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false as const,
      errors: parsed.error.flatten().fieldErrors,
      message: "Motif de signalement invalide (minimum 5 caractères).",
    };
  }

  const result = await useCases.reportPublication.execute({
    ...parsed.data,
    reporterId: session.id,
  });

  if (!result.ok) {
    return { ok: false as const, message: result.message };
  }

  revalidatePath(`/requests/${parsed.data.requestId}`);
  return { ok: true as const };
}

export async function resolveReportAction(
  reportId: string,
  action: "DELETE_PUBLICATION" | "DISMISS"
) {
  const session = await getCurrentSession();
  if (!session || session.role !== "ADMIN") {
    return { ok: false as const, message: "Accès refusé. Réservé aux administrateurs." };
  }

  const result = await useCases.resolveReport.execute(reportId, session.id, action);
  if (!result.ok) {
    return { ok: false as const, message: result.message };
  }

  revalidatePath("/admin");
  revalidatePath("/requests");
  return { ok: true as const };
}

export async function adminDeleteUserAction(userId: string) {
  const session = await getCurrentSession();
  if (!session || session.role !== "ADMIN") {
    return { ok: false as const, message: "Accès refusé. Réservé aux administrateurs." };
  }

  const result = await useCases.deleteUser.execute(session.id, userId);
  if (!result.ok) {
    return { ok: false as const, message: result.message };
  }

  revalidatePath("/admin");
  return { ok: true as const };
}

export async function adminDeletePublicationAction(requestId: string) {
  const session = await getCurrentSession();
  if (!session || session.role !== "ADMIN") {
    return { ok: false as const, message: "Accès refusé. Réservé aux administrateurs." };
  }

  const result = await useCases.adminDeletePublication.execute(session.id, requestId);
  if (!result.ok) {
    return { ok: false as const, message: result.message };
  }

  revalidatePath("/admin");
  revalidatePath("/requests");
  return { ok: true as const };
}
