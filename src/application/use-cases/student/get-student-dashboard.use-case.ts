import { UserRepository } from "../../ports/user-repository.port";
import { HelpRequestRepository } from "../../ports/help-request-repository.port";
import { ProposalRepository } from "../../ports/proposal-repository.port";
import { SessionReviewRepository } from "../../ports/session-review-repository.port";
import { UserId } from "../../../domain/user/user-id";
import { Result, ok, fail } from "../../common/result";

export class GetStudentDashboardUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly requestRepository: HelpRequestRepository,
    private readonly proposalRepository: ProposalRepository,
    private readonly reviewRepository: SessionReviewRepository
  ) {}

  async execute(userIdString: string): Promise<Result<{
    student: {
      id: string;
      name: string;
      email: string;
      speciality: string;
      level: string;
      skills: string[];
      bio?: string;
      reputationPoints: number;
      badges: string[];
    };
    myRequests: Array<{
      id: string;
      title: string;
      subject: string;
      level: string;
      status: "OPEN" | "ACCEPTED" | "COMPLETED";
      createdAt: Date;
      proposalsCount: number;
      selectedHelperName?: string;
    }>;
    myProposals: Array<{
      id: string;
      requestId: string;
      requestTitle: string;
      requestSubject: string;
      status: "PENDING" | "ACCEPTED" | "REJECTED";
      message: string;
      createdAt: Date;
    }>;
    completedSessions: Array<{
      requestId: string;
      title: string;
      subject: string;
      role: "DEMANDEUR" | "TUTEUR";
      completedDate: Date;
      partnerName: string;
      hasReviewed: boolean;
    }>;
    reviewsReceived: Array<{
      id: string;
      rating: number;
      comment: string;
      reviewerName: string;
      createdAt: Date;
    }>;
  }>> {
    try {
      const userId = UserId.from(userIdString);
      const user = await this.userRepository.byId(userId);
      if (!user) {
        return fail("UTILISATEUR_INTROUVABLE", "Utilisateur non trouvé.");
      }

      const userSnapshot = user.snapshot();

      // 1. My requests
      const authoredRequests = await this.requestRepository.byAuthor(userId);
      const myRequests = await Promise.all(
        authoredRequests.map(async (req) => {
          const reqSnap = req.snapshot();
          const proposals = await this.proposalRepository.byRequest(req.id);
          let helperName: string | undefined;
          if (reqSnap.selectedHelperId) {
            const helper = await this.userRepository.byId(UserId.from(reqSnap.selectedHelperId));
            helperName = helper?.snapshot().name;
          }
          return {
            id: reqSnap.id,
            title: reqSnap.title,
            subject: reqSnap.subject,
            level: reqSnap.level,
            status: reqSnap.status,
            createdAt: reqSnap.createdAt,
            proposalsCount: proposals.length,
            selectedHelperName: helperName,
          };
        })
      );

      // 2. My proposals
      const submittedProposals = await this.proposalRepository.byHelper(userId);
      const myProposals = await Promise.all(
        submittedProposals.map(async (prop) => {
          const propSnap = prop.snapshot();
          const targetReq = await this.requestRepository.byId(prop.snapshot().requestId as any);
          return {
            id: propSnap.id,
            requestId: propSnap.requestId,
            requestTitle: targetReq ? targetReq.snapshot().title : "Demande",
            requestSubject: targetReq ? targetReq.snapshot().subject : "Général",
            status: propSnap.status,
            message: propSnap.message,
            createdAt: propSnap.createdAt,
          };
        })
      );

      // 3. Completed sessions (where user was author or helper)
      const assignedHelperRequests = await this.requestRepository.byAssignedHelper(userId);
      const allMyCompletedRequests = [
        ...authoredRequests.filter((r) => r.isCompleted()),
        ...assignedHelperRequests.filter((r) => r.isCompleted()),
      ];

      // Deduplicate by id
      const uniqueCompleted = Array.from(
        new Map(allMyCompletedRequests.map((r) => [r.id.value, r])).values()
      );

      const completedSessions = await Promise.all(
        uniqueCompleted.map(async (req) => {
          const snap = req.snapshot();
          const isAuthor = snap.authorId === userIdString;
          const partnerId = isAuthor ? snap.selectedHelperId : snap.authorId;
          let partnerName = "Camarade";
          if (partnerId) {
            const partner = await this.userRepository.byId(UserId.from(partnerId));
            if (partner) partnerName = partner.snapshot().name;
          }
          const hasReviewed = await this.reviewRepository.alreadyReviewed(req.id, userId);

          return {
            requestId: snap.id,
            title: snap.title,
            subject: snap.subject,
            role: isAuthor ? ("DEMANDEUR" as const) : ("TUTEUR" as const),
            completedDate: snap.updatedAt,
            partnerName,
            hasReviewed,
          };
        })
      );

      // 4. Reviews received
      const reviews = await this.reviewRepository.byReviewee(userId);
      const reviewsReceived = await Promise.all(
        reviews.map(async (rev) => {
          const rSnap = rev.snapshot();
          const reviewer = await this.userRepository.byId(UserId.from(rSnap.reviewerId));
          return {
            id: rSnap.id,
            rating: rSnap.rating,
            comment: rSnap.comment,
            reviewerName: reviewer ? reviewer.snapshot().name : "Étudiant",
            createdAt: rSnap.createdAt,
          };
        })
      );

      return ok({
        student: {
          id: userSnapshot.id,
          name: userSnapshot.name,
          email: userSnapshot.email,
          speciality: userSnapshot.speciality,
          level: userSnapshot.level,
          skills: userSnapshot.skills,
          bio: userSnapshot.bio,
          reputationPoints: userSnapshot.reputationPoints,
          badges: userSnapshot.badges,
        },
        myRequests,
        myProposals,
        completedSessions,
        reviewsReceived,
      });
    } catch (e: unknown) {
      if (e instanceof Error) {
        return fail("ERREUR_TABLEAU_DE_BORD", e.message);
      }
      return fail("ERREUR_INCONNUE", "Impossible de charger le tableau de bord.");
    }
  }
}
