import { ReportId } from "./report-id";
import { HelpRequestId } from "../help-request/help-request-id";
import { UserId } from "../user/user-id";
import { MotifSignalementRequisError } from "./report-errors";

export type ReportStatus = "PENDING" | "RESOLVED" | "DISMISSED";

export interface ReportProps {
  reason: string;
  details?: string;
  status: ReportStatus;
  requestId: HelpRequestId;
  reporterId: UserId;
  createdAt: Date;
  resolvedAt?: Date;
}

export interface CreateReportProps {
  reason: string;
  details?: string;
  requestId: HelpRequestId;
  reporterId: UserId;
}

export class Report {
  private constructor(
    readonly id: ReportId,
    private props: ReportProps
  ) {}

  static create(props: CreateReportProps): Report {
    const trimmedReason = props.reason.trim();
    if (trimmedReason.length < 5) {
      throw new MotifSignalementRequisError();
    }

    return new Report(ReportId.next(), {
      reason: trimmedReason,
      details: props.details?.trim(),
      status: "PENDING",
      requestId: props.requestId,
      reporterId: props.reporterId,
      createdAt: new Date(),
    });
  }

  static restore(id: ReportId, props: ReportProps): Report {
    return new Report(id, props);
  }

  resolve(): void {
    this.props.status = "RESOLVED";
    this.props.resolvedAt = new Date();
  }

  dismiss(): void {
    this.props.status = "DISMISSED";
    this.props.resolvedAt = new Date();
  }

  snapshot(): {
    id: string;
    reason: string;
    details?: string;
    status: ReportStatus;
    requestId: string;
    reporterId: string;
    createdAt: Date;
    resolvedAt?: Date;
  } {
    return {
      id: this.id.value,
      reason: this.props.reason,
      details: this.props.details,
      status: this.props.status,
      requestId: this.props.requestId.value,
      reporterId: this.props.reporterId.value,
      createdAt: this.props.createdAt,
      resolvedAt: this.props.resolvedAt,
    };
  }
}
