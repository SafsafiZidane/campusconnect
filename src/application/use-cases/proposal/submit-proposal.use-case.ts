import { ProposalRepository } from "../../ports/proposal-repository.port";
import { HelpRequestRepository } from "../../ports/help-request-repository.port";
import { UserRepository } from "../../ports/user-repository.port";
import { Proposal } from "../../../domain/proposal/proposal";
import { HelpRequestId } from "../../../domain/help-request/help-request-id";
import { UserId } from "../../../domain/user/user-id";
import {
  ActionNonAutoriseeError,
  DemandeDejaClotureeError,
  AutoPropositionInterditeError,
} from "../../../domain/help-request/help-request-errors";
import { Result, ok, fail } from "../../common/result";

export interface SubmitProposalInput {
  requestId: string;
  helperId: string;
  message: string;
  proposedAvailability?: string;
}

export class SubmitProposalUseCase {
  constructor(
    private readonly proposalRepository: ProposalRepository,
    private readonly requestRepository: HelpRequestRepository,
    private readonly userRepository: UserRepository
  ) {}

  async execute(input: SubmitProposalInput): Promise<Result<{ id: string }>> {
    try {
      const requestId = HelpRequestId.from(input.requestId);
      const helperId = UserId.from(input.helperId);

      const request = await this.requestRepository.byId(requestId);
      if (!request) {
        return fail("DEMANDE_INTROUVABLE", "Demande d'aide introuvable.");
      }

      const reqSnap = request.snapshot();
      if (reqSnap.authorId === input.helperId) {
        return fail("AUTO_PROPOSITION_INTERDITE", "Vous ne pouvez pas proposer de l'aide sur votre propre demande.");
      }

      if (!request.canReceiveProposals()) {
        return fail("DEMANDE_FERMEE", "Cette demande est fermée et n'accepte plus de propositions.");
      }

      const existingProposals = await this.proposalRepository.byRequest(requestId);
      const alreadyProposed = existingProposals.some(
        (p) => p.snapshot().helperId === input.helperId
      );
      if (alreadyProposed) {
        return fail("PROPOSITION_DEJA_SOUMISE", "Vous avez déjà soumis une proposition pour cette demande.");
      }

      const proposal = Proposal.create({
        requestId,
        helperId,
        message: input.message,
        proposedAvailability: input.proposedAvailability,
      });

      await this.proposalRepository.save(proposal);
      return ok({ id: proposal.id.value });
    } catch (e: unknown) {
      if (e instanceof Error) {
        return fail("ERREUR_PROPOSITION", e.message);
      }
      return fail("ERREUR_INCONNUE", "Impossible de soumettre votre proposition d'aide.");
    }
  }
}
