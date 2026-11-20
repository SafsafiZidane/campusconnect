import type { Proposal as ProposalRow } from "@prisma/client";
import { Proposal, ProposalStatus } from "../../domain/proposal/proposal";
import { ProposalId } from "../../domain/proposal/proposal-id";
import { HelpRequestId } from "../../domain/help-request/help-request-id";
import { UserId } from "../../domain/user/user-id";

export const ProposalMapper = {
  toDomain(row: ProposalRow): Proposal {
    return Proposal.restore(ProposalId.from(row.id), {
      message: row.message,
      proposedAvailability: row.proposedAvailability ?? undefined,
      status: row.status as ProposalStatus,
      requestId: HelpRequestId.from(row.requestId),
      helperId: UserId.from(row.helperId),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  },

  toPersistence(proposal: Proposal): {
    id: string;
    message: string;
    proposedAvailability: string | null;
    status: "PENDING" | "ACCEPTED" | "REJECTED";
    requestId: string;
    helperId: string;
    updatedAt: Date;
  } {
    const s = proposal.snapshot();
    return {
      id: s.id,
      message: s.message,
      proposedAvailability: s.proposedAvailability || null,
      status: s.status,
      requestId: s.requestId,
      helperId: s.helperId,
      updatedAt: s.updatedAt,
    };
  },
};
