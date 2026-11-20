import { ReportRepository } from "../../ports/report-repository.port";
import { HelpRequestRepository } from "../../ports/help-request-repository.port";
import { Report } from "../../../domain/report/report";
import { HelpRequestId } from "../../../domain/help-request/help-request-id";
import { UserId } from "../../../domain/user/user-id";
import { Result, ok, fail } from "../../common/result";

export interface ReportPublicationInput {
  requestId: string;
  reporterId: string;
  reason: string;
  details?: string;
}

export class ReportPublicationUseCase {
  constructor(
    private readonly reportRepository: ReportRepository,
    private readonly requestRepository: HelpRequestRepository
  ) {}

  async execute(input: ReportPublicationInput): Promise<Result<{ id: string }>> {
    try {
      const requestId = HelpRequestId.from(input.requestId);
      const reporterId = UserId.from(input.reporterId);

      const request = await this.requestRepository.byId(requestId);
      if (!request) {
        return fail("DEMANDE_INTROUVABLE", "Demande introuvable.");
      }

      const report = Report.create({
        requestId,
        reporterId,
        reason: input.reason,
        details: input.details,
      });

      request.markAsReported();

      await this.reportRepository.save(report);
      await this.requestRepository.save(request);

      return ok({ id: report.id.value });
    } catch (e: unknown) {
      if (e instanceof Error) {
        return fail("ERREUR_SIGNALEMENT", e.message);
      }
      return fail("ERREUR_INCONNUE", "Impossible de signaler la publication.");
    }
  }
}
