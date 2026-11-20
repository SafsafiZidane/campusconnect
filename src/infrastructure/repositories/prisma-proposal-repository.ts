import { prisma } from "../db/prisma";
import { ProposalRepository } from "../../application/ports/proposal-repository.port";
import { Proposal } from "../../domain/proposal/proposal";
import { ProposalId } from "../../domain/proposal/proposal-id";
import { HelpRequestId } from "../../domain/help-request/help-request-id";
import { UserId } from "../../domain/user/user-id";
import { ProposalMapper } from "../mappers/proposal.mapper";

export class PrismaProposalRepository implements ProposalRepository {
  async save(proposal: Proposal): Promise<void> {
    const data = ProposalMapper.toPersistence(proposal);
    await prisma.proposal.upsert({
      where: { id: data.id },
      create: data,
      update: data,
    });
  }

  async byId(id: ProposalId): Promise<Proposal | null> {
    const row = await prisma.proposal.findUnique({
      where: { id: id.value },
    });
    return row ? ProposalMapper.toDomain(row) : null;
  }

  async byRequest(requestId: HelpRequestId): Promise<Proposal[]> {
    const rows = await prisma.proposal.findMany({
      where: { requestId: requestId.value },
      orderBy: { createdAt: "asc" },
    });
    return rows.map(ProposalMapper.toDomain);
  }

  async byHelper(helperId: UserId): Promise<Proposal[]> {
    const rows = await prisma.proposal.findMany({
      where: { helperId: helperId.value },
      orderBy: { createdAt: "desc" },
    });
    return rows.map(ProposalMapper.toDomain);
  }

  async rejectOtherPendingProposals(
    requestId: HelpRequestId,
    exceptProposalId: ProposalId
  ): Promise<void> {
    await prisma.proposal.updateMany({
      where: {
        requestId: requestId.value,
        id: { not: exceptProposalId.value },
        status: "PENDING",
      },
      data: {
        status: "REJECTED",
        updatedAt: new Date(),
      },
    });
  }
}
