import { ReportRepository } from "../../ports/report-repository.port";
import { HelpRequestRepository } from "../../ports/help-request-repository.port";
import { UserRepository } from "../../ports/user-repository.port";
import { UserId } from "../../../domain/user/user-id";
import { HelpRequestId } from "../../../domain/help-request/help-request-id";
import { ActionNonAutoriseeError } from "../../../domain/help-request/help-request-errors";
import { Result, ok, fail } from "../../common/result";

export interface ReportedPublicationDTO {
  reportId: string;
  reason: string;
  details?: string;
  reportStatus: "PENDING" | "RESOLVED" | "DISMISSED";
  reportDate: Date;
  reporter: {
    id: string;
    name: string;
    email: string;
  };
  request: {
    id: string;
    title: string;
    subject: string;
    level: string;
    status: string;
    authorName: string;
  };
}

export class ListReportedPublicationsUseCase {
  constructor(
    private readonly reportRepository: ReportRepository,
    private readonly requestRepository: HelpRequestRepository,
    private readonly userRepository: UserRepository
  ) {}

  async execute(adminUserIdString: string): Promise<Result<ReportedPublicationDTO[]>> {
    try {
      const adminId = UserId.from(adminUserIdString);
      const admin = await this.userRepository.byId(adminId);
      if (!admin || !admin.isAdmin()) {
        throw new ActionNonAutoriseeError("Accès réservé aux administrateurs de la plateforme.");
      }

      const reports = await this.reportRepository.all();

      const list: ReportedPublicationDTO[] = await Promise.all(
        reports.map(async (rep) => {
          const snap = rep.snapshot();
          const reporter = await this.userRepository.byId(UserId.from(snap.reporterId));
          const req = await this.requestRepository.byId(HelpRequestId.from(snap.requestId));
          let authorName = "Inconnu";
          if (req) {
            const author = await this.userRepository.byId(UserId.from(req.snapshot().authorId));
            if (author) authorName = author.snapshot().name;
          }

          return {
            reportId: snap.id,
            reason: snap.reason,
            details: snap.details,
            reportStatus: snap.status,
            reportDate: snap.createdAt,
            reporter: {
              id: snap.reporterId,
              name: reporter ? reporter.snapshot().name : "Utilisateur",
              email: reporter ? reporter.snapshot().email : "",
            },
            request: {
              id: snap.requestId,
              title: req ? req.snapshot().title : "Demande supprimée",
              subject: req ? req.snapshot().subject : "-",
              level: req ? req.snapshot().level : "-",
              status: req ? req.snapshot().status : "DELETED",
              authorName,
            },
          };
        })
      );

      return ok(list);
    } catch (e: unknown) {
      if (e instanceof Error) {
        return fail("ACCES_REFUSE", e.message);
      }
      return fail("ERREUR_INCONNUE", "Impossible de récupérer les signalements.");
    }
  }
}
