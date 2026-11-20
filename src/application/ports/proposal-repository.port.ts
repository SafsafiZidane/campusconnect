import { Proposal } from "../../domain/proposal/proposal";
import { ProposalId } from "../../domain/proposal/proposal-id";
import { HelpRequestId } from "../../domain/help-request/help-request-id";
import { UserId } from "../../domain/user/user-id";

export interface ProposalRepository {
  save(proposal: Proposal): Promise<void>;
  byId(id: ProposalId): Promise<Proposal | null>;
  byRequest(requestId: HelpRequestId): Promise<Proposal[]>;
  byHelper(helperId: UserId): Promise<Proposal[]>;
  rejectOtherPendingProposals(requestId: HelpRequestId, exceptProposalId: ProposalId): Promise<void>;
}
