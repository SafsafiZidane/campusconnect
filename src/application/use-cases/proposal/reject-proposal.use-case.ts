import { ProposalRepository } from "../../ports/proposal-repository.port";
import { HelpRequestRepository } from "../../ports/help-request-repository.port";
import { ProposalId } from "../../../domain/proposal/proposal-id";
import { HelpRequestId } from "../../../domain/help-request/help-request-id";
import { UserId } from "../../../domain/user/user-id";
import { ActionNonAutoriseeError } from "../../../domain/help-request/help-request-errors";
import { Result, ok, fail } from "../../common/result";

export class RejectProposalUseCase {
  constructor(
    private readonly proposalRepository: ProposalRepository,
    private readonly requestRepository: HelpRequestRepository
  ) {}

  async execute(proposalIdString: string, authorIdString: string): Promise<Result<{ id: string }>> {
    try {
      const proposalId = ProposalId.from(proposalIdString);
      const authorId = UserId.from(authorIdString);

      const proposal = await this.proposalRepository.byId(proposalId);
      if (!proposal) {
        return fail("PROPOSITION_INTROUVABLE", "Proposition introuvable.");
      }

      const propSnap = proposal.snapshot();
      const request = await this.requestRepository.byId(HelpRequestId.from(propSnap.requestId));
      if (!request) {
        return fail("DEMANDE_INTROUVABLE", "Demande introuvable.");
      }

      // Check author
      if (request.snapshot().authorId !== authorIdString) {
        throw new ActionNonAutoriseeError("Seul l'auteur de la demande peut refuser une proposition.");
      }

      proposal.reject();
      await this.proposalRepository.save(proposal);

      return ok({ id: proposal.id.value });
    } catch (e: unknown) {
      if (e instanceof Error) {
        return fail("ERREUR_REFUS_PROPOSITION", e.message);
      }
      return fail("ERREUR_INCONNUE", "Impossible de refuser cette proposition.");
    }
  }
}
