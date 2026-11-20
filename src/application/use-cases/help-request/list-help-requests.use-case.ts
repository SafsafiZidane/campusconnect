import { HelpRequestRepository, HelpRequestFilters } from "../../ports/help-request-repository.port";
import { UserRepository } from "../../ports/user-repository.port";
import { ProposalRepository } from "../../ports/proposal-repository.port";
import { UserId } from "../../../domain/user/user-id";
import { Result, ok, fail } from "../../common/result";

export interface HelpRequestListItemDTO {
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
    reputationPoints: number;
    badges: string[];
  };
  proposalsCount: number;
}

export class ListHelpRequestsUseCase {
  constructor(
    private readonly requestRepository: HelpRequestRepository,
    private readonly userRepository: UserRepository,
    private readonly proposalRepository: ProposalRepository
  ) {}

  async execute(filters?: HelpRequestFilters): Promise<Result<HelpRequestListItemDTO[]>> {
    try {
      const requests = await this.requestRepository.all(filters);

      const list: HelpRequestListItemDTO[] = await Promise.all(
        requests.map(async (req) => {
          const snap = req.snapshot();
          const author = await this.userRepository.byId(UserId.from(snap.authorId));
          const authorSnap = author
            ? author.snapshot()
            : {
                id: snap.authorId,
                name: "Étudiant",
                speciality: "Général",
                level: "Tous",
                reputationPoints: 0,
                badges: [],
              };

          const proposals = await this.proposalRepository.byRequest(req.id);

          return {
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
              reputationPoints: authorSnap.reputationPoints,
              badges: authorSnap.badges,
            },
            proposalsCount: proposals.length,
          };
        })
      );

      return ok(list);
    } catch (e: unknown) {
      if (e instanceof Error) {
        return fail("ERREUR_LISTE_DEMANDES", e.message);
      }
      return fail("ERREUR_INCONNUE", "Impossible de récupérer les demandes.");
    }
  }
}
