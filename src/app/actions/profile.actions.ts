"use server";

import { revalidatePath } from "next/cache";
import { useCases } from "@/container";
import { getCurrentSession } from "@/lib/auth/session";
import { UpdateProfileSchema } from "@/lib/schemas/profile.schema";

export async function updateProfileAction(formData: FormData) {
  const session = await getCurrentSession();
  if (!session) {
    return { ok: false as const, message: "Vous devez être connecté." };
  }

  const raw = {
    name: formData.get("name"),
    speciality: formData.get("speciality"),
    level: formData.get("level"),
    skills: formData.get("skills"),
    bio: formData.get("bio") || undefined,
  };

  const parsed = UpdateProfileSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false as const,
      errors: parsed.error.flatten().fieldErrors,
      message: "Veuillez corriger les informations du profil.",
    };
  }

  const skillsArray = parsed.data.skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const result = await useCases.updateProfile.execute({
    userId: session.id,
    name: parsed.data.name,
    speciality: parsed.data.speciality,
    level: parsed.data.level,
    skills: skillsArray,
    bio: parsed.data.bio,
  });

  if (!result.ok) {
    return { ok: false as const, message: result.message };
  }

  revalidatePath("/profile");
  revalidatePath("/dashboard");
  return { ok: true as const };
}
