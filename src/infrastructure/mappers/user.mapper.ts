import type { User as UserRow } from "@prisma/client";
import { User, UserRole } from "../../domain/user/user";
import { UserId } from "../../domain/user/user-id";

export const UserMapper = {
  toDomain(row: UserRow): User {
    const skills = row.skills
      ? row.skills.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    const badges = row.badges
      ? row.badges.split(",").map((b) => b.trim()).filter(Boolean)
      : [];

    return User.restore(UserId.from(row.id), {
      email: row.email,
      passwordHash: row.password,
      name: row.name,
      role: row.role as UserRole,
      speciality: row.speciality,
      level: row.level,
      skills,
      bio: row.bio ?? undefined,
      reputationPoints: row.reputationPoints,
      badges,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  },

  toPersistence(user: User): {
    id: string;
    email: string;
    password: string;
    name: string;
    role: "STUDENT" | "ADMIN";
    speciality: string;
    level: string;
    skills: string;
    bio: string | null;
    reputationPoints: number;
    badges: string;
    updatedAt: Date;
  } {
    const s = user.snapshot();
    return {
      id: s.id,
      email: s.email,
      password: s.passwordHash,
      name: s.name,
      role: s.role,
      speciality: s.speciality,
      level: s.level,
      skills: s.skills.join(", "),
      bio: s.bio || null,
      reputationPoints: s.reputationPoints,
      badges: s.badges.join(", "),
      updatedAt: s.updatedAt,
    };
  },
};
