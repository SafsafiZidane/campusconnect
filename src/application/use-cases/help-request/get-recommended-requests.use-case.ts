import { HelpRequestRepository } from "../../ports/help-request-repository.port";
import { UserRepository } from "../../ports/user-repository.port";
import { ProposalRepository } from "../../ports/proposal-repository.port";
import { UserId } from "../../../domain/user/user-id";
import { Result, ok, fail } from "../../common/result";

export interface RecommendedRequestDTO {
  id: string;
  title: string;
  description: string;
  subject: string;
  level: string;
  availability: string;
  createdAt: Date;
  authorName: string;
  matchScore: number; // percentage match
  matchingSkills: string[];
  proposalsCount: number;
}

export class GetRecommendedRequestsUseCase {
  constructor(
    private readonly requestRepository: HelpRequestRepository,
    private readonly userRepository: UserRepository,
    private readonly proposalRepository: ProposalRepository
  ) {}

  async execute(userIdString: string): Promise<Result<RecommendedRequestDTO[]>> {
    try {
      const userId = UserId.from(userIdString);
      const user = await this.userRepository.byId(userId);
      if (!user) {
        return fail("UTILISATEUR_INTROUVABLE", "Utilisateur non trouvé.");
      }

      const userSkills = user.snapshot().skills.map((s) => s.toLowerCase().trim());
      if (userSkills.length === 0) {
        return ok([]);
      }

      // Fetch all open requests
      const openRequests = await this.requestRepository.all({ status: "OPEN" });

      const scoredList: RecommendedRequestDTO[] = [];

      for (const req of openRequests) {
        const snap = req.snapshot();

        // Do not recommend own requests
        if (snap.authorId === userIdString) continue;

        const textToAnalyze = `${snap.subject} ${snap.title} ${snap.description}`.toLowerCase();
        const matched: string[] = [];

        for (const skill of userSkills) {
          if (textToAnalyze.includes(skill)) {
            matched.push(skill);
          }
        }

        if (matched.length > 0) {
          const matchScore = Math.min(100, Math.round((matched.length / Math.max(1, userSkills.length)) * 100) + 40);
          const author = await this.userRepository.byId(UserId.from(snap.authorId));
          const proposals = await this.proposalRepository.byRequest(req.id);

          scoredList.push({
            id: snap.id,
            title: snap.title,
            description: snap.description,
            subject: snap.subject,
            level: snap.level,
            availability: snap.availability,
            createdAt: snap.createdAt,
            authorName: author ? author.snapshot().name : "Étudiant",
            matchScore,
            matchingSkills: matched,
            proposalsCount: proposals.length,
          });
        }
      }

      // Sort by highest match score first, then newest
      scoredList.sort((a, b) => b.matchScore - a.matchScore || b.createdAt.getTime() - a.createdAt.getTime());

      return ok(scoredList.slice(0, 5));
    } catch (e: unknown) {
      if (e instanceof Error) {
        return fail("ERREUR_RECOMMANDATION", e.message);
      }
      return fail("ERREUR_INCONNUE", "Impossible de calculer les recommandations.");
    }
  }
}
