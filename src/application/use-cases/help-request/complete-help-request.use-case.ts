import { HelpRequestRepository } from "../../ports/help-request-repository.port";
import { HelpRequestId } from "../../../domain/help-request/help-request-id";
import { UserId } from "../../../domain/user/user-id";
import { Result, ok, fail } from "../../common/result";

export class CompleteHelpRequestUseCase {
  constructor(private readonly requestRepository: HelpRequestRepository) {}

  async execute(requestIdString: string, userIdString: string): Promise<Result<{ id: string }>> {
    try {
      const requestId = HelpRequestId.from(requestIdString);
      const userId = UserId.from(userIdString);

      const request = await this.requestRepository.byId(requestId);
      if (!request) {
        return fail("DEMANDE_INTROUVABLE", "Demande d'aide introuvable.");
      }

      request.completeSession(userId);
      await this.requestRepository.save(request);

      return ok({ id: request.id.value });
    } catch (e: unknown) {
      if (e instanceof Error) {
        return fail("ERREUR_CLOTURE_DEMANDE", e.message);
      }
      return fail("ERREUR_INCONNUE", "Impossible de marquer la demande comme terminée.");
    }
  }
}
