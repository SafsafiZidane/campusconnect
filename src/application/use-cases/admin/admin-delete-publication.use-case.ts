import { HelpRequestRepository } from "../../ports/help-request-repository.port";
import { UserRepository } from "../../ports/user-repository.port";
import { UserId } from "../../../domain/user/user-id";
import { HelpRequestId } from "../../../domain/help-request/help-request-id";
import { ActionNonAutoriseeError } from "../../../domain/help-request/help-request-errors";
import { Result, ok, fail } from "../../common/result";

export class AdminDeletePublicationUseCase {
  constructor(
    private readonly helpRequestRepository: HelpRequestRepository,
    private readonly userRepository: UserRepository
  ) {}

  async execute(adminUserIdString: string, requestIdString: string): Promise<Result<void>> {
    try {
      const adminId = UserId.from(adminUserIdString);
      const admin = await this.userRepository.byId(adminId);
      if (!admin || !admin.isAdmin()) {
        throw new ActionNonAutoriseeError("Accès réservé aux administrateurs.");
      }

      const requestId = HelpRequestId.from(requestIdString);
      const request = await this.helpRequestRepository.byId(requestId);
      if (!request) {
        return fail("PUBLICATION_INTROUVABLE", "Cette publication n'existe pas ou a déjà été supprimée.");
      }

      await this.helpRequestRepository.delete(requestId);
      return ok(undefined);
    } catch (e: unknown) {
      if (e instanceof Error) {
        return fail("ACCES_REFUSE", e.message);
      }
      return fail("ERREUR_INCONNUE", "Impossible de supprimer cette publication.");
    }
  }
}
