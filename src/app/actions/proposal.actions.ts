"use server";

import { revalidatePath } from "next/cache";
import { useCases } from "@/container";
import { getCurrentSession } from "@/lib/auth/session";
import { SubmitProposalSchema } from "@/lib/schemas/proposal.schema";

export async function submitProposalAction(formData: FormData) {
  const session = await getCurrentSession();
  if (!session) {
    return { ok: false as const, message: "Vous devez être connecté pour proposer votre aide." };
  }

  const raw = {
    requestId: formData.get("requestId"),
    message: formData.get("message"),
    proposedAvailability: formData.get("proposedAvailability") || undefined,
  };

  const parsed = SubmitProposalSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false as const,
      errors: parsed.error.flatten().fieldErrors,
      message: "Message de proposition invalide (minimum 5 caractères).",
    };
  }

  const result = await useCases.submitProposal.execute({
    ...parsed.data,
    helperId: session.id,
  });

  if (!result.ok) {
    return { ok: false as const, message: result.message };
  }

  revalidatePath(`/requests/${parsed.data.requestId}`);
  revalidatePath("/dashboard");
  return { ok: true as const, proposalId: result.value.id };
}

export async function acceptProposalAction(proposalId: string, requestId: string) {
  const session = await getCurrentSession();
  if (!session) {
    return { ok: false as const, message: "Vous devez être connecté." };
  }

  const result = await useCases.acceptProposal.execute(proposalId, session.id);
  if (!result.ok) {
    return { ok: false as const, message: result.message };
  }

  revalidatePath(`/requests/${requestId}`);
  revalidatePath("/dashboard");
  return { ok: true as const };
}

export async function rejectProposalAction(proposalId: string, requestId: string) {
  const session = await getCurrentSession();
  if (!session) {
    return { ok: false as const, message: "Vous devez être connecté." };
  }

  const result = await useCases.rejectProposal.execute(proposalId, session.id);
  if (!result.ok) {
    return { ok: false as const, message: result.message };
  }

  revalidatePath(`/requests/${requestId}`);
  revalidatePath("/dashboard");
  return { ok: true as const };
}
