import { HelpRequestRepository } from "../../ports/help-request-repository.port";
import { UserRepository } from "../../ports/user-repository.port";
import { ProposalRepository } from "../../ports/proposal-repository.port";
import { SessionReviewRepository } from "../../ports/session-review-repository.port";
import { HelpRequestId } from "../../../domain/help-request/help-request-id";
import { UserId } from "../../../domain/user/user-id";
import { Result, ok, fail } from "../../common/result";

export interface ProposalDetailDTO {
  id: string;
  message: string;
  proposedAvailability?: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: Date;
  helper: {
    id: string;
    name: string;
    speciality: string;
    level: string;
    skills: string[];
    reputationPoints: number;
    badges: string[];
  };
}

export interface HelpRequestDetailDTO {
  id: string;
  title: string;
  description: string;
  subject: string;
  level: string;
  availability: string;
  status: "OPEN" | "ACCEPTED" | "COMPLETED";
  isReported: boolean;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    name: string;
    speciality: string;
    level: string;
    skills: string[];
    reputationPoints: number;
    badges: string[];
  };
  selectedHelper?: {
    id: string;
    name: string;
    speciality: string;
    level: string;
    reputationPoints: number;
    badges: string[];
  };
  proposals: ProposalDetailDTO[];
  canUserPropose: boolean;
  isAuthor: boolean;
  isParticipant: boolean;
  hasUserReviewed: boolean;
}

export class GetHelpRequestByIdUseCase {
  constructor(
    private readonly requestRepository: HelpRequestRepository,
    private readonly userRepository: UserRepository,
    private readonly proposalRepository: ProposalRepository,
    private readonly reviewRepository: SessionReviewRepository
  ) {}

  async execute(
    requestIdString: string,
    currentUserIdString?: string
  ): Promise<Result<HelpRequestDetailDTO>> {
    try {
      const requestId = HelpRequestId.from(requestIdString);
      const request = await this.requestRepository.byId(requestId);
      if (!request) {
        return fail("DEMANDE_INTROUVABLE", "Demande d'aide introuvable.");
      }

      const snap = request.snapshot();
      const author = await this.userRepository.byId(UserId.from(snap.authorId));
      const authorSnap = author
        ? author.snapshot()
        : {
            id: snap.authorId,
            name: "Étudiant",
            speciality: "Général",
            level: "Tous",
            skills: [],
            reputationPoints: 0,
            badges: [],
          };

      let selectedHelper: HelpRequestDetailDTO["selectedHelper"];
      if (snap.selectedHelperId) {
        const helper = await this.userRepository.byId(UserId.from(snap.selectedHelperId));
        if (helper) {
          const hSnap = helper.snapshot();
          selectedHelper = {
            id: hSnap.id,
            name: hSnap.name,
            speciality: hSnap.speciality,
            level: hSnap.level,
            reputationPoints: hSnap.reputationPoints,
            badges: hSnap.badges,
          };
        }
      }

      const allProposals = await this.proposalRepository.byRequest(requestId);
      const isAuthor = currentUserIdString === snap.authorId;
      const currentUserId = currentUserIdString ? UserId.from(currentUserIdString) : null;
      const isParticipant = currentUserId ? request.isParticipant(currentUserId) : false;

      // Map proposals with helper user details
      const detailedProposals: ProposalDetailDTO[] = await Promise.all(
        allProposals.map(async (p) => {
          const pSnap = p.snapshot();
          const helper = await this.userRepository.byId(UserId.from(pSnap.helperId));
          const hSnap = helper
            ? helper.snapshot()
            : {
                id: pSnap.helperId,
                name: "Étudiant",
                speciality: "Général",
                level: "Tous",
                skills: [],
                reputationPoints: 0,
                badges: [],
              };

          return {
            id: pSnap.id,
            message: pSnap.message,
            proposedAvailability: pSnap.proposedAvailability,
            status: pSnap.status,
            createdAt: pSnap.createdAt,
            helper: {
              id: hSnap.id,
              name: hSnap.name,
              speciality: hSnap.speciality,
              level: hSnap.level,
              skills: hSnap.skills,
              reputationPoints: hSnap.reputationPoints,
              badges: hSnap.badges,
            },
          };
        })
      );

      // Filtering visible proposals: Author sees all; non-author only sees their own proposal
      const visibleProposals = isAuthor
        ? detailedProposals
        : detailedProposals.filter((p) => p.helper.id === currentUserIdString);

      // Check if current user has already proposed
      const alreadyProposed = allProposals.some(
        (p) => p.snapshot().helperId === currentUserIdString
      );

      const canUserPropose =
        Boolean(currentUserIdString) &&
        !isAuthor &&
        !alreadyProposed &&
        request.canReceiveProposals();

      let hasUserReviewed = false;
      if (currentUserId && request.isCompleted()) {
        hasUserReviewed = await this.reviewRepository.alreadyReviewed(requestId, currentUserId);
      }

      return ok({
        id: snap.id,
        title: snap.title,
        description: snap.description,
        subject: snap.subject,
        level: snap.level,
        availability: snap.availability,
        status: snap.status,
        isReported: snap.isReported,
        createdAt: snap.createdAt,
        updatedAt: snap.updatedAt,
        author: {
          id: authorSnap.id,
          name: authorSnap.name,
          speciality: authorSnap.speciality,
          level: authorSnap.level,
          skills: authorSnap.skills,
          reputationPoints: authorSnap.reputationPoints,
          badges: authorSnap.badges,
        },
        selectedHelper,
        proposals: visibleProposals,
        canUserPropose,
        isAuthor,
        isParticipant,
        hasUserReviewed,
      });
    } catch (e: unknown) {
      if (e instanceof Error) {
        return fail("ERREUR_LECTURE_DEMANDE", e.message);
      }
      return fail("ERREUR_INCONNUE", "Impossible de charger les détails de la demande.");
    }
  }
}
