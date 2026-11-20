import { HelpRequestRepository } from "../../ports/help-request-repository.port";
import { UserRepository } from "../../ports/user-repository.port";
import { ProposalRepository } from "../../ports/proposal-repository.port";
import { UserId } from "../../../domain/user/user-id";
import { HelpRequestId } from "../../../domain/help-request/help-request-id";
import { ActionNonAutoriseeError } from "../../../domain/help-request/help-request-errors";
import { Result, ok, fail } from "../../common/result";

export interface AdminPublicationDTO {
  id: string;
  title: string;
  description: string;
  subject: string;
  level: string;
  availability: string;
  status: string;
  isReported: boolean;
  authorId: string;
  authorName: string;
  authorEmail: string;
  proposalCount: number;
  createdAt: Date;
}

export class ListAllPublicationsUseCase {
  constructor(
    private readonly helpRequestRepository: HelpRequestRepository,
    private readonly userRepository: UserRepository,
    private readonly proposalRepository: ProposalRepository
  ) {}

  async execute(adminUserIdString: string): Promise<Result<AdminPublicationDTO[]>> {
    try {
      const adminId = UserId.from(adminUserIdString);
      const admin = await this.userRepository.byId(adminId);
      if (!admin || !admin.isAdmin()) {
        throw new ActionNonAutoriseeError("Accès réservé aux administrateurs.");
      }

      const requests = await this.helpRequestRepository.all();

      const list: AdminPublicationDTO[] = await Promise.all(
        requests.map(async (req) => {
          const snap = req.snapshot();
          const author = await this.userRepository.byId(UserId.from(snap.authorId));
          const proposals = await this.proposalRepository.byRequest(HelpRequestId.from(snap.id));

          return {
            id: snap.id,
            title: snap.title,
            description: snap.description,
            subject: snap.subject,
            level: snap.level,
            availability: snap.availability,
            status: snap.status,
            isReported: snap.isReported,
            authorId: snap.authorId,
            authorName: author ? author.snapshot().name : "Utilisateur supprimé",
            authorEmail: author ? author.snapshot().email : "",
            proposalCount: proposals.length,
            createdAt: snap.createdAt,
          };
        })
      );

      return ok(list);
    } catch (e: unknown) {
      if (e instanceof Error) {
        return fail("ACCES_REFUSE", e.message);
      }
      return fail("ERREUR_INCONNUE", "Impossible de récupérer les publications.");
    }
  }
}
