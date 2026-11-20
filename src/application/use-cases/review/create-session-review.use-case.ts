import { SessionReviewRepository } from "../../ports/session-review-repository.port";
import { HelpRequestRepository } from "../../ports/help-request-repository.port";
import { UserRepository } from "../../ports/user-repository.port";
import { SessionReview } from "../../../domain/session-review/session-review";
import { HelpRequestId } from "../../../domain/help-request/help-request-id";
import { UserId } from "../../../domain/user/user-id";
import {
  EvaluationNonAutoriseeError,
  EvaluationDejaDonneeError,
} from "../../../domain/session-review/review-errors";
import { Result, ok, fail } from "../../common/result";

export interface CreateSessionReviewInput {
  requestId: string;
  reviewerId: string;
  rating: number; // 1-5
  comment: string;
}

export class CreateSessionReviewUseCase {
  constructor(
    private readonly reviewRepository: SessionReviewRepository,
    private readonly requestRepository: HelpRequestRepository,
    private readonly userRepository: UserRepository
  ) {}

  async execute(input: CreateSessionReviewInput): Promise<Result<{ id: string }>> {
    try {
      const requestId = HelpRequestId.from(input.requestId);
      const reviewerId = UserId.from(input.reviewerId);

      const request = await this.requestRepository.byId(requestId);
      if (!request) {
        return fail("DEMANDE_INTROUVABLE", "Demande d'aide introuvable.");
      }

      // Check: must be COMPLETED
      if (!request.isCompleted()) {
        return fail(
          "SEANCE_NON_CLOTUREE",
          "Une évaluation est autorisée uniquement après la clôture de la séance."
        );
      }

      // Check: must be participant
      if (!request.isParticipant(reviewerId)) {
        return fail(
          "NON_PARTICIPANT",
          "Seuls les participants à la séance (auteur ou tuteur) peuvent émettre un avis."
        );
      }

      // Check: already reviewed?
      const already = await this.reviewRepository.alreadyReviewed(requestId, reviewerId);
      if (already) {
        throw new EvaluationDejaDonneeError();
      }

      // Determine who the reviewee is
      const reqSnap = request.snapshot();
      const isAuthor = reqSnap.authorId === input.reviewerId;
      const revieweeIdString = isAuthor ? reqSnap.selectedHelperId : reqSnap.authorId;

      if (!revieweeIdString) {
        return fail("DESTINATAIRE_INTROUVABLE", "Le partenaire de la séance n'a pas pu être identifié.");
      }

      const revieweeId = UserId.from(revieweeIdString);

      const review = SessionReview.create({
        rating: input.rating,
        comment: input.comment,
        requestId,
        reviewerId,
        revieweeId,
      });

      await this.reviewRepository.save(review);

      // Award reputation points & update badges to the reviewee!
      const reviewee = await this.userRepository.byId(revieweeId);
      if (reviewee) {
        reviewee.awardHelpCompletedPoints(input.rating);
        await this.userRepository.save(reviewee);
      }

      return ok({ id: review.id.value });
    } catch (e: unknown) {
      if (e instanceof Error) {
        return fail("ERREUR_EVALUATION", e.message);
      }
      return fail("ERREUR_INCONNUE", "Impossible d'enregistrer votre évaluation.");
    }
  }
}
