import { ReviewId } from "./review-id";
import { HelpRequestId } from "../help-request/help-request-id";
import { UserId } from "../user/user-id";
import {
  NoteInvalideError,
  CommentaireTropCourtError,
} from "./review-errors";

export interface SessionReviewProps {
  rating: number; // 1-5
  comment: string;
  requestId: HelpRequestId;
  reviewerId: UserId;
  revieweeId: UserId;
  createdAt: Date;
}

export interface CreateSessionReviewProps {
  rating: number;
  comment: string;
  requestId: HelpRequestId;
  reviewerId: UserId;
  revieweeId: UserId;
}

export class SessionReview {
  private constructor(
    readonly id: ReviewId,
    private props: SessionReviewProps
  ) {}

  static create(props: CreateSessionReviewProps): SessionReview {
    if (!Number.isInteger(props.rating) || props.rating < 1 || props.rating > 5) {
      throw new NoteInvalideError();
    }

    const trimmedComment = props.comment.trim();
    if (trimmedComment.length < 3) {
      throw new CommentaireTropCourtError();
    }

    return new SessionReview(ReviewId.next(), {
      rating: props.rating,
      comment: trimmedComment,
      requestId: props.requestId,
      reviewerId: props.reviewerId,
      revieweeId: props.revieweeId,
      createdAt: new Date(),
    });
  }

  static restore(id: ReviewId, props: SessionReviewProps): SessionReview {
    return new SessionReview(id, props);
  }

  snapshot(): {
    id: string;
    rating: number;
    comment: string;
    requestId: string;
    reviewerId: string;
    revieweeId: string;
    createdAt: Date;
  } {
    return {
      id: this.id.value,
      rating: this.props.rating,
      comment: this.props.comment,
      requestId: this.props.requestId.value,
      reviewerId: this.props.reviewerId.value,
      revieweeId: this.props.revieweeId.value,
      createdAt: this.props.createdAt,
    };
  }
}
