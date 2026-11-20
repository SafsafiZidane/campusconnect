import { ReportRepository } from "../../ports/report-repository.port";
import { HelpRequestRepository } from "../../ports/help-request-repository.port";
import { UserRepository } from "../../ports/user-repository.port";
import { ReportId } from "../../../domain/report/report-id";
import { HelpRequestId } from "../../../domain/help-request/help-request-id";
import { UserId } from "../../../domain/user/user-id";
import { ActionNonAutoriseeError } from "../../../domain/help-request/help-request-errors";
import { Result, ok, fail } from "../../common/result";

export class ResolveReportUseCase {
  constructor(
    private readonly reportRepository: ReportRepository,
    private readonly requestRepository: HelpRequestRepository,
    private readonly userRepository: UserRepository
  ) {}

  async execute(
    reportIdString: string,
    adminUserIdString: string,
    action: "DELETE_PUBLICATION" | "DISMISS"
  ): Promise<Result<{ success: boolean }>> {
    try {
      const adminId = UserId.from(adminUserIdString);
      const admin = await this.userRepository.byId(adminId);
      if (!admin || !admin.isAdmin()) {
        throw new ActionNonAutoriseeError("Accès réservé aux administrateurs.");
      }

      const reportId = ReportId.from(reportIdString);
      const report = await this.reportRepository.byId(reportId);
      if (!report) {
        return fail("SIGNALEMENT_INTROUVABLE", "Signalement introuvable.");
      }

      const repSnap = report.snapshot();
      const requestId = HelpRequestId.from(repSnap.requestId);

      if (action === "DELETE_PUBLICATION") {
        await this.requestRepository.delete(requestId);
        report.resolve();
      } else {
        const req = await this.requestRepository.byId(requestId);
        if (req) {
          req.clearReported();
          await this.requestRepository.save(req);
        }
        report.dismiss();
      }

      await this.reportRepository.save(report);
      return ok({ success: true });
    } catch (e: unknown) {
      if (e instanceof Error) {
        return fail("ERREUR_MODERATION", e.message);
      }
      return fail("ERREUR_INCONNUE", "Impossible de traiter le signalement.");
    }
  }
}
