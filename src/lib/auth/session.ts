import { cookies } from "next/headers";
import { useCases } from "@/container";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: "STUDENT" | "ADMIN";
  speciality: string;
  level: string;
  skills: string[];
  bio?: string;
  reputationPoints: number;
  badges: string[];
}

export async function getCurrentSession(): Promise<SessionUser | null> {
  const cookieStore = cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return null;

  const result = await useCases.getCurrentUser.execute(token);
  if (!result.ok) {
    return null;
  }

  return result.value;
}
