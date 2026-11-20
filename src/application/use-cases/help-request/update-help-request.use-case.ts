import { HelpRequestRepository } from "../../ports/help-request-repository.port";
import { HelpRequestId } from "../../../domain/help-request/help-request-id";
import { UserId } from "../../../domain/user/user-id";
import { Result, ok, fail } from "../../common/result";

export interface UpdateHelpRequestInput {
  requestId: string;
  userId: string;
  title?: string;
  description?: string;
  subject?: string;
  level?: string;
  availability?: string;
}

export class UpdateHelpRequestUseCase {
  constructor(private readonly requestRepository: HelpRequestRepository) {}

  async execute(input: UpdateHelpRequestInput): Promise<Result<{ id: string }>> {
    try {
      const requestId = HelpRequestId.from(input.requestId);
      const userId = UserId.from(input.userId);

      const request = await this.requestRepository.byId(requestId);
      if (!request) {
        return fail("DEMANDE_INTROUVABLE", "Demande d'aide introuvable.");
      }

      request.modify(userId, {
        title: input.title,
        description: input.description,
        subject: input.subject,
        level: input.level,
        availability: input.availability,
      });

      await this.requestRepository.save(request);
      return ok({ id: request.id.value });
    } catch (e: unknown) {
      if (e instanceof Error) {
        return fail("ERREUR_MODIFICATION_DEMANDE", e.message);
      }
      return fail("ERREUR_INCONNUE", "Impossible de mettre à jour la demande.");
    }
  }
}
