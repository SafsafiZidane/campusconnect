import { UserRepository } from "../../ports/user-repository.port";
import { UserId } from "../../../domain/user/user-id";
import { Result, ok, fail } from "../../common/result";

export interface UpdateProfileInput {
  userId: string;
  name?: string;
  speciality?: string;
  level?: string;
  skills?: string[];
  bio?: string;
}

export class UpdateProfileUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: UpdateProfileInput): Promise<Result<{ id: string; name: string }>> {
    try {
      const user = await this.userRepository.byId(UserId.from(input.userId));
      if (!user) {
        return fail("UTILISATEUR_INTROUVABLE", "Utilisateur non trouvé.");
      }

      user.updateProfile({
        name: input.name,
        speciality: input.speciality,
        level: input.level,
        skills: input.skills,
        bio: input.bio,
      });

      await this.userRepository.save(user);
      const s = user.snapshot();
      return ok({ id: s.id, name: s.name });
    } catch (e: unknown) {
      if (e instanceof Error) {
        return fail("ERREUR_MISE_A_JOUR", e.message);
      }
      return fail("ERREUR_INCONNUE", "Impossible de mettre à jour le profil.");
    }
  }
}
