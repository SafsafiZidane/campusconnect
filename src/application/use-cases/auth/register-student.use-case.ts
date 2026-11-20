import { UserRepository } from "../../ports/user-repository.port";
import { PasswordHasher } from "../../ports/password-hasher.port";
import { TokenService } from "../../ports/token-service.port";
import { User } from "../../../domain/user/user";
import { EmailDejaUtiliseError } from "../../../domain/user/user-errors";
import { Result, ok, fail } from "../../common/result";

export interface RegisterStudentInput {
  email: string;
  password: string;
  name: string;
  speciality: string;
  level: string;
  skills: string[];
  bio?: string;
}

export interface AuthOutput {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: "STUDENT" | "ADMIN";
    speciality: string;
    level: string;
    skills: string[];
    reputationPoints: number;
    badges: string[];
  };
}

export class RegisterStudentUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenService: TokenService
  ) {}

  async execute(input: RegisterStudentInput): Promise<Result<AuthOutput>> {
    try {
      const existing = await this.userRepository.byEmail(input.email);
      if (existing) {
        return fail("EMAIL_DEJA_UTILISE", "Un compte existe déjà avec cette adresse email.");
      }

      const passwordHash = await this.passwordHasher.hash(input.password);
      const student = User.createStudent({
        email: input.email,
        passwordHash,
        name: input.name,
        speciality: input.speciality,
        level: input.level,
        skills: input.skills,
        bio: input.bio,
      });

      await this.userRepository.save(student);
      const snapshot = student.snapshot();

      const token = this.tokenService.sign({
        userId: snapshot.id,
        email: snapshot.email,
        name: snapshot.name,
        role: snapshot.role,
      });

      return ok({
        token,
        user: {
          id: snapshot.id,
          email: snapshot.email,
          name: snapshot.name,
          role: snapshot.role,
          speciality: snapshot.speciality,
          level: snapshot.level,
          skills: snapshot.skills,
          reputationPoints: snapshot.reputationPoints,
          badges: snapshot.badges,
        },
      });
    } catch (e: unknown) {
      if (e instanceof EmailDejaUtiliseError) {
        return fail(e.code, e.message);
      }
      if (e instanceof Error) {
        return fail("ERREUR_ENREGISTREMENT", e.message);
      }
      return fail("ERREUR_INCONNUE", "Une erreur inattendue est survenue.");
    }
  }
}
