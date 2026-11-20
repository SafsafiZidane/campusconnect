import type { Report as ReportRow } from "@prisma/client";
import { Report, ReportStatus } from "../../domain/report/report";
import { ReportId } from "../../domain/report/report-id";
import { HelpRequestId } from "../../domain/help-request/help-request-id";
import { UserId } from "../../domain/user/user-id";

export const ReportMapper = {
  toDomain(row: ReportRow): Report {
    return Report.restore(ReportId.from(row.id), {
      reason: row.reason,
      details: row.details ?? undefined,
      status: row.status as ReportStatus,
      requestId: HelpRequestId.from(row.requestId),
      reporterId: UserId.from(row.reporterId),
      createdAt: row.createdAt,
      resolvedAt: row.resolvedAt ?? undefined,
    });
  },

  toPersistence(report: Report): {
    id: string;
    reason: string;
    details: string | null;
    status: "PENDING" | "RESOLVED" | "DISMISSED";
    requestId: string;
    reporterId: string;
    resolvedAt: Date | null;
  } {
    const s = report.snapshot();
    return {
      id: s.id,
      reason: s.reason,
      details: s.details || null,
      status: s.status,
      requestId: s.requestId,
      reporterId: s.reporterId,
      resolvedAt: s.resolvedAt || null,
    };
  },
};
