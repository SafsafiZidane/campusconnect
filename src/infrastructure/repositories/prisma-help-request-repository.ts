import { prisma } from "../db/prisma";
import {
  HelpRequestRepository,
  HelpRequestFilters,
} from "../../application/ports/help-request-repository.port";
import { HelpRequest } from "../../domain/help-request/help-request";
import { HelpRequestId } from "../../domain/help-request/help-request-id";
import { UserId } from "../../domain/user/user-id";
import { HelpRequestMapper } from "../mappers/help-request.mapper";
import { Prisma } from "@prisma/client";

export class PrismaHelpRequestRepository implements HelpRequestRepository {
  async save(request: HelpRequest): Promise<void> {
    const data = HelpRequestMapper.toPersistence(request);
    await prisma.helpRequest.upsert({
      where: { id: data.id },
      create: data,
      update: data,
    });
  }

  async byId(id: HelpRequestId): Promise<HelpRequest | null> {
    const row = await prisma.helpRequest.findFirst({
      where: { id: id.value },
    });
    return row ? HelpRequestMapper.toDomain(row) : null;
  }

  async all(filters?: HelpRequestFilters): Promise<HelpRequest[]> {
    const where: Prisma.HelpRequestWhereInput = {};

    if (filters?.subject && filters.subject !== "TOUS") {
      where.subject = { contains: filters.subject, mode: "insensitive" };
    }

    if (filters?.level && filters.level !== "TOUS") {
      where.level = { contains: filters.level, mode: "insensitive" };
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.query && filters.query.trim().length > 0) {
      const q = filters.query.trim();
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { subject: { contains: q, mode: "insensitive" } },
      ];
    }

    const rows = await prisma.helpRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return rows.map(HelpRequestMapper.toDomain);
  }

  async byAuthor(authorId: UserId): Promise<HelpRequest[]> {
    const rows = await prisma.helpRequest.findMany({
      where: { authorId: authorId.value },
      orderBy: { createdAt: "desc" },
    });
    return rows.map(HelpRequestMapper.toDomain);
  }

  async byAssignedHelper(helperId: UserId): Promise<HelpRequest[]> {
    const rows = await prisma.helpRequest.findMany({
      where: { selectedHelperId: helperId.value },
      orderBy: { createdAt: "desc" },
    });
    return rows.map(HelpRequestMapper.toDomain);
  }

  async allReported(): Promise<HelpRequest[]> {
    const rows = await prisma.helpRequest.findMany({
      where: { isReported: true },
      orderBy: { updatedAt: "desc" },
    });
    return rows.map(HelpRequestMapper.toDomain);
  }

  async delete(id: HelpRequestId): Promise<void> {
    await prisma.helpRequest.delete({
      where: { id: id.value },
    });
  }
}
