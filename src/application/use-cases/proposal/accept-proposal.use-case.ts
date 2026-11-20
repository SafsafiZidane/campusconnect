import { ProposalRepository } from "../../ports/proposal-repository.port";
import { HelpRequestRepository } from "../../ports/help-request-repository.port";
import { UserRepository } from "../../ports/user-repository.port";
import { ProposalId } from "../../../domain/proposal/proposal-id";
import { HelpRequestId } from "../../../domain/help-request/help-request-id";
import { UserId } from "../../../domain/user/user-id";
import { Result, ok, fail } from "../../common/result";

export class AcceptProposalUseCase {
  constructor(
    private readonly proposalRepository: ProposalRepository,
    private readonly requestRepository: HelpRequestRepository,
    private readonly userRepository: UserRepository
  ) {}

  async execute(
    proposalIdString: string,
    authorIdString: string
  ): Promise<Result<{ requestId: string }>> {
    try {
      const proposalId = ProposalId.from(proposalIdString);
      const authorId = UserId.from(authorIdString);

      const proposal = await this.proposalRepository.byId(proposalId);
      if (!proposal) {
        return fail("PROPOSITION_INTROUVABLE", "Proposition introuvable.");
      }

      const propSnap = proposal.snapshot();
      const requestId = HelpRequestId.from(propSnap.requestId);
      const request = await this.requestRepository.byId(requestId);
      if (!request) {
        return fail("DEMANDE_INTROUVABLE", "Demande associée introuvable.");
      }

      // Domain check: author accepts
      const helperId = UserId.from(propSnap.helperId);
      request.acceptProposal(authorId, helperId);
      proposal.accept();

      await this.requestRepository.save(request);
      await this.proposalRepository.save(proposal);

      // Automatically reject other pending proposals
      await this.proposalRepository.rejectOtherPendingProposals(requestId, proposalId);

      // Reward helper with initial selection bonus (+5 points)
      const helper = await this.userRepository.byId(helperId);
      if (helper) {
        helper.awardHelpCompletedPoints(2); // small encouragement points
        await this.userRepository.save(helper);
      }

      return ok({ requestId: reqSnapId(request) });
    } catch (e: unknown) {
      if (e instanceof Error) {
        return fail("ERREUR_ACCEPTATION", e.message);
      }
      return fail("ERREUR_INCONNUE", "Impossible d'accepter cette proposition.");
    }
  }
}

function reqSnapId(req: { id: { value: string } }): string {
  return req.id.value;
}
