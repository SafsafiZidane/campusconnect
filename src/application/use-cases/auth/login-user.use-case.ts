import { UserRepository } from "../../ports/user-repository.port";
import { PasswordHasher } from "../../ports/password-hasher.port";
import { TokenService } from "../../ports/token-service.port";
import { Result, ok, fail } from "../../common/result";
import { AuthOutput } from "./register-student.use-case";

export interface LoginUserInput {
  email: string;
  password: string;
}

export class LoginUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenService: TokenService
  ) {}

  async execute(input: LoginUserInput): Promise<Result<AuthOutput>> {
    try {
      const trimmedEmail = input.email.trim().toLowerCase();
      const user = await this.userRepository.byEmail(trimmedEmail);
      if (!user) {
        return fail("IDENTIFIANTS_INVALIDES", "Email ou mot de passe incorrect.");
      }

      const snapshot = user.snapshot();
      const matches = await this.passwordHasher.compare(input.password, snapshot.passwordHash);
      if (!matches) {
        return fail("IDENTIFIANTS_INVALIDES", "Email ou mot de passe incorrect.");
      }

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
      if (e instanceof Error) {
        return fail("ERREUR_CONNEXION", e.message);
      }
      return fail("ERREUR_INCONNUE", "Une erreur inattendue est survenue.");
    }
  }
}
