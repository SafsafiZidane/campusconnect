import { Report } from "../../domain/report/report";
import { ReportId } from "../../domain/report/report-id";
import { HelpRequestId } from "../../domain/help-request/help-request-id";

export interface ReportRepository {
  save(report: Report): Promise<void>;
  byId(id: ReportId): Promise<Report | null>;
  allPending(): Promise<Report[]>;
  all(): Promise<Report[]>;
  byRequest(requestId: HelpRequestId): Promise<Report[]>;
}
