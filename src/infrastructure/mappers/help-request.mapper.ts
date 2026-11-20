import type { HelpRequest as HelpRequestRow } from "@prisma/client";
import { HelpRequest, HelpRequestStatus } from "../../domain/help-request/help-request";
import { HelpRequestId } from "../../domain/help-request/help-request-id";
import { UserId } from "../../domain/user/user-id";

export const HelpRequestMapper = {
  toDomain(row: HelpRequestRow): HelpRequest {
    return HelpRequest.restore(HelpRequestId.from(row.id), {
      title: row.title,
      description: row.description,
      subject: row.subject,
      level: row.level,
      availability: row.availability,
      status: row.status as HelpRequestStatus,
      authorId: UserId.from(row.authorId),
      selectedHelperId: row.selectedHelperId ? UserId.from(row.selectedHelperId) : undefined,
      isReported: row.isReported,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  },

  toPersistence(request: HelpRequest): {
    id: string;
    title: string;
    description: string;
    subject: string;
    level: string;
    availability: string;
    status: "OPEN" | "ACCEPTED" | "COMPLETED";
    authorId: string;
    selectedHelperId: string | null;
    isReported: boolean;
    updatedAt: Date;
  } {
    const s = request.snapshot();
    return {
      id: s.id,
      title: s.title,
      description: s.description,
      subject: s.subject,
      level: s.level,
      availability: s.availability,
      status: s.status,
      authorId: s.authorId,
      selectedHelperId: s.selectedHelperId || null,
      isReported: s.isReported,
      updatedAt: s.updatedAt,
    };
  },
};
