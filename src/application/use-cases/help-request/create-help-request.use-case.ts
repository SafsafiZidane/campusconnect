import { HelpRequestRepository } from "../../ports/help-request-repository.port";
import { UserRepository } from "../../ports/user-repository.port";
import { HelpRequest } from "../../../domain/help-request/help-request";
import { UserId } from "../../../domain/user/user-id";
import { Result, ok, fail } from "../../common/result";

export interface CreateHelpRequestInput {
  title: string;
  description: string;
  subject: string;
  level: string;
  availability: string;
  authorId: string;
}

export class CreateHelpRequestUseCase {
  constructor(
    private readonly requestRepository: HelpRequestRepository,
    private readonly userRepository: UserRepository
  ) {}

  async execute(input: CreateHelpRequestInput): Promise<Result<{ id: string }>> {
    try {
      const authorId = UserId.from(input.authorId);
      const user = await this.userRepository.byId(authorId);
      if (!user) {
        return fail("UTILISATEUR_INTROUVABLE", "Auteur introuvable.");
      }

      const request = HelpRequest.create({
        title: input.title,
        description: input.description,
        subject: input.subject,
        level: input.level,
        availability: input.availability,
        authorId,
      });

      await this.requestRepository.save(request);
      return ok({ id: request.id.value });
    } catch (e: unknown) {
      if (e instanceof Error) {
        return fail("ERREUR_CREATION_DEMANDE", e.message);
      }
      return fail("ERREUR_INCONNUE", "Impossible de créer la demande d'aide.");
    }
  }
}
