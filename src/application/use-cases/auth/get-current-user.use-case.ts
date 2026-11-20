import { UserRepository } from "../../ports/user-repository.port";
import { TokenService } from "../../ports/token-service.port";
import { UserId } from "../../../domain/user/user-id";
import { Result, ok, fail } from "../../common/result";

export class GetCurrentUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService
  ) {}

  async execute(token: string): Promise<Result<{
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
  }>> {
    try {
      const payload = this.tokenService.verify(token);
      if (!payload) {
        return fail("SESSION_INVALIDE", "Votre session a expiré ou est invalide.");
      }

      const user = await this.userRepository.byId(UserId.from(payload.userId));
      if (!user) {
        return fail("UTILISATEUR_INTROUVABLE", "Utilisateur non trouvé.");
      }

      const snapshot = user.snapshot();
      return ok({
        id: snapshot.id,
        email: snapshot.email,
        name: snapshot.name,
        role: snapshot.role,
        speciality: snapshot.speciality,
        level: snapshot.level,
        skills: snapshot.skills,
        bio: snapshot.bio,
        reputationPoints: snapshot.reputationPoints,
        badges: snapshot.badges,
      });
    } catch {
      return fail("ERREUR_SESSION", "Erreur lors de la vérification de la session.");
    }
  }
}
