import { UserRepository } from "../../ports/user-repository.port";
import { UserId } from "../../../domain/user/user-id";
import { ActionNonAutoriseeError } from "../../../domain/help-request/help-request-errors";
import { Result, ok, fail } from "../../common/result";

export class DeleteUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(adminUserIdString: string, targetUserIdString: string): Promise<Result<void>> {
    try {
      const adminId = UserId.from(adminUserIdString);
      const admin = await this.userRepository.byId(adminId);
      if (!admin || !admin.isAdmin()) {
        throw new ActionNonAutoriseeError("Accès réservé aux administrateurs.");
      }

      const targetId = UserId.from(targetUserIdString);
      const target = await this.userRepository.byId(targetId);
      if (!target) {
        return fail("UTILISATEUR_INTROUVABLE", "Cet utilisateur n'existe pas.");
      }

      // Prevent admin from deleting themselves
      if (adminId.equals(targetId)) {
        return fail("AUTO_SUPPRESSION", "Un administrateur ne peut pas supprimer son propre compte.");
      }

      // Prevent deleting other admins
      if (target.isAdmin()) {
        return fail("SUPPRESSION_ADMIN", "Impossible de supprimer un compte administrateur.");
      }

      await this.userRepository.delete(targetId);
      return ok(undefined);
    } catch (e: unknown) {
      if (e instanceof Error) {
        return fail("ACCES_REFUSE", e.message);
      }
      return fail("ERREUR_INCONNUE", "Impossible de supprimer cet utilisateur.");
    }
  }
}
