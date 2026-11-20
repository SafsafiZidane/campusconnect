import { UserId } from "./user-id";
import {
  EmailInvalideError,
  NomTropCourtError,
  MotDePasseTropFaibleError,
} from "./user-errors";

export type UserRole = "STUDENT" | "ADMIN";

export interface UserProps {
  email: string;
  passwordHash: string;
  name: string;
  role: UserRole;
  speciality: string;
  level: string;
  skills: string[];
  bio?: string;
  reputationPoints: number;
  badges: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateStudentProps {
  email: string;
  passwordHash: string;
  name: string;
  speciality: string;
  level: string;
  skills: string[];
  bio?: string;
}

export class User {
  private constructor(
    readonly id: UserId,
    private props: UserProps
  ) {}

  static createStudent(props: CreateStudentProps): User {
    const trimmedEmail = props.email.trim().toLowerCase();
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      throw new EmailInvalideError(props.email);
    }

    const trimmedName = props.name.trim();
    if (trimmedName.length < 2) {
      throw new NomTropCourtError(props.name);
    }

    if (!props.passwordHash || props.passwordHash.length < 6) {
      throw new MotDePasseTropFaibleError();
    }

    const cleanedSkills = props.skills
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const now = new Date();
    return new User(UserId.next(), {
      email: trimmedEmail,
      passwordHash: props.passwordHash,
      name: trimmedName,
      role: "STUDENT",
      speciality: props.speciality.trim() || "Informatique",
      level: props.level.trim() || "Licence 3",
      skills: cleanedSkills.length > 0 ? cleanedSkills : ["Algorithmique"],
      bio: props.bio?.trim() || "",
      reputationPoints: 10, // Points de bienvenue pour inciter au partage
      badges: ["Membre Campus"],
      createdAt: now,
      updatedAt: now,
    });
  }

  static createAdmin(email: string, passwordHash: string, name: string): User {
    const trimmedEmail = email.trim().toLowerCase();
    const now = new Date();
    return new User(UserId.next(), {
      email: trimmedEmail,
      passwordHash,
      name: name.trim(),
      role: "ADMIN",
      speciality: "Administration",
      level: "Responsable",
      skills: ["Modération", "Administration"],
      bio: "Administrateur de la plateforme CampusConnect",
      reputationPoints: 100,
      badges: ["Administrateur", "Modérateur Officiel"],
      createdAt: now,
      updatedAt: now,
    });
  }

  static restore(id: UserId, props: UserProps): User {
    return new User(id, props);
  }

  updateProfile(data: {
    name?: string;
    speciality?: string;
    level?: string;
    skills?: string[];
    bio?: string;
  }): void {
    if (data.name !== undefined) {
      const trimmed = data.name.trim();
      if (trimmed.length < 2) throw new NomTropCourtError(data.name);
      this.props.name = trimmed;
    }

    if (data.speciality !== undefined) {
      this.props.speciality = data.speciality.trim();
    }

    if (data.level !== undefined) {
      this.props.level = data.level.trim();
    }

    if (data.skills !== undefined) {
      this.props.skills = data.skills
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    }

    if (data.bio !== undefined) {
      this.props.bio = data.bio.trim();
    }

    this.props.updatedAt = new Date();
  }

  awardHelpCompletedPoints(rating: number): void {
    // Calcul réputation : 15 pts par séance + bonus de note (5*2 = 10 pts)
    const pointsEarned = 15 + Math.round(rating * 2);
    this.props.reputationPoints += pointsEarned;
    this.recalculateBadges();
    this.props.updatedAt = new Date();
  }

  private recalculateBadges(): void {
    const badges = new Set<string>(this.props.badges);

    if (this.props.reputationPoints >= 30) {
      badges.add("Tuteur Actif");
    }
    if (this.props.reputationPoints >= 60) {
      badges.add("Mentor Campus");
    }
    if (this.props.reputationPoints >= 100) {
      badges.add("Excellence Académique");
    }

    this.props.badges = Array.from(badges);
  }

  isAdmin(): boolean {
    return this.props.role === "ADMIN";
  }

  snapshot(): UserProps & { id: string } {
    return {
      id: this.id.value,
      email: this.props.email,
      passwordHash: this.props.passwordHash,
      name: this.props.name,
      role: this.props.role,
      speciality: this.props.speciality,
      level: this.props.level,
      skills: [...this.props.skills],
      bio: this.props.bio,
      reputationPoints: this.props.reputationPoints,
      badges: [...this.props.badges],
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }
}
