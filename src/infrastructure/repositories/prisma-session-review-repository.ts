import { prisma } from "../db/prisma";
import { SessionReviewRepository } from "../../application/ports/session-review-repository.port";
import { SessionReview } from "../../domain/session-review/session-review";
import { ReviewId } from "../../domain/session-review/review-id";
import { HelpRequestId } from "../../domain/help-request/help-request-id";
import { UserId } from "../../domain/user/user-id";
import { SessionReviewMapper } from "../mappers/session-review.mapper";

export class PrismaSessionReviewRepository implements SessionReviewRepository {
  async save(review: SessionReview): Promise<void> {
    const data = SessionReviewMapper.toPersistence(review);
    await prisma.sessionReview.upsert({
      where: { id: data.id },
      create: data,
      update: data,
    });
  }

  async byId(id: ReviewId): Promise<SessionReview | null> {
    const row = await prisma.sessionReview.findUnique({
      where: { id: id.value },
    });
    return row ? SessionReviewMapper.toDomain(row) : null;
  }

  async byRequest(requestId: HelpRequestId): Promise<SessionReview[]> {
    const rows = await prisma.sessionReview.findMany({
      where: { requestId: requestId.value },
      orderBy: { createdAt: "desc" },
    });
    return rows.map(SessionReviewMapper.toDomain);
  }

  async byReviewee(userId: UserId): Promise<SessionReview[]> {
    const rows = await prisma.sessionReview.findMany({
      where: { revieweeId: userId.value },
      orderBy: { createdAt: "desc" },
    });
    return rows.map(SessionReviewMapper.toDomain);
  }

  async alreadyReviewed(requestId: HelpRequestId, reviewerId: UserId): Promise<boolean> {
    const count = await prisma.sessionReview.count({
      where: {
        requestId: requestId.value,
        reviewerId: reviewerId.value,
      },
    });
    return count > 0;
  }
}
