import type { SessionReview as SessionReviewRow } from "@prisma/client";
import { SessionReview } from "../../domain/session-review/session-review";
import { ReviewId } from "../../domain/session-review/review-id";
import { HelpRequestId } from "../../domain/help-request/help-request-id";
import { UserId } from "../../domain/user/user-id";

export const SessionReviewMapper = {
  toDomain(row: SessionReviewRow): SessionReview {
    return SessionReview.restore(ReviewId.from(row.id), {
      rating: row.rating,
      comment: row.comment,
      requestId: HelpRequestId.from(row.requestId),
      reviewerId: UserId.from(row.reviewerId),
      revieweeId: UserId.from(row.revieweeId),
      createdAt: row.createdAt,
    });
  },

  toPersistence(review: SessionReview): {
    id: string;
    rating: number;
    comment: string;
    requestId: string;
    reviewerId: string;
    revieweeId: string;
    createdAt: Date;
  } {
    const s = review.snapshot();
    return {
      id: s.id,
      rating: s.rating,
      comment: s.comment,
      requestId: s.requestId,
      reviewerId: s.reviewerId,
      revieweeId: s.revieweeId,
      createdAt: s.createdAt,
    };
  },
};
