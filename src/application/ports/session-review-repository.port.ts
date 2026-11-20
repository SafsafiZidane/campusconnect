import { SessionReview } from "../../domain/session-review/session-review";
import { ReviewId } from "../../domain/session-review/review-id";
import { HelpRequestId } from "../../domain/help-request/help-request-id";
import { UserId } from "../../domain/user/user-id";

export interface SessionReviewRepository {
  save(review: SessionReview): Promise<void>;
  byId(id: ReviewId): Promise<SessionReview | null>;
  byRequest(requestId: HelpRequestId): Promise<SessionReview[]>;
  byReviewee(userId: UserId): Promise<SessionReview[]>;
  alreadyReviewed(requestId: HelpRequestId, reviewerId: UserId): Promise<boolean>;
}
