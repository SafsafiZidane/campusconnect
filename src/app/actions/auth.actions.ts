"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { useCases } from "@/container";
import { RegisterStudentSchema, LoginUserSchema } from "@/lib/schemas/auth.schema";

export async function registerAction(formData: FormData) {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    speciality: formData.get("speciality"),
    level: formData.get("level"),
    skills: formData.get("skills"),
    bio: formData.get("bio") || undefined,
  };

  const parsed = RegisterStudentSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false as const,
      errors: parsed.error.flatten().fieldErrors,
      message: "Veuillez vérifier les informations saisies.",
    };
  }

  const skillsArray = parsed.data.skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const result = await useCases.registerStudent.execute({
    ...parsed.data,
    skills: skillsArray,
  });

  if (!result.ok) {
    return {
      ok: false as const,
      message: result.message,
    };
  }

  // Set auth cookie
  cookies().set("auth_token", result.value.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  revalidatePath("/");
  return { ok: true as const, user: result.value.user };
}

export async function loginAction(formData: FormData) {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = LoginUserSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false as const,
      errors: parsed.error.flatten().fieldErrors,
      message: "Veuillez saisir un email et un mot de passe valides.",
    };
  }

  const result = await useCases.loginUser.execute(parsed.data);
  if (!result.ok) {
    return {
      ok: false as const,
      message: result.message,
    };
  }

  cookies().set("auth_token", result.value.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  revalidatePath("/");
  return { ok: true as const, user: result.value.user };
}

export async function logoutAction() {
  cookies().delete("auth_token");
  revalidatePath("/");
  redirect("/login");
}
