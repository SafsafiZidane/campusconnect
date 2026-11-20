import { prisma } from "../db/prisma";
import { ReportRepository } from "../../application/ports/report-repository.port";
import { Report } from "../../domain/report/report";
import { ReportId } from "../../domain/report/report-id";
import { HelpRequestId } from "../../domain/help-request/help-request-id";
import { ReportMapper } from "../mappers/report.mapper";

export class PrismaReportRepository implements ReportRepository {
  async save(report: Report): Promise<void> {
    const data = ReportMapper.toPersistence(report);
    await prisma.report.upsert({
      where: { id: data.id },
      create: data,
      update: data,
    });
  }

  async byId(id: ReportId): Promise<Report | null> {
    const row = await prisma.report.findUnique({
      where: { id: id.value },
    });
    return row ? ReportMapper.toDomain(row) : null;
  }

  async allPending(): Promise<Report[]> {
    const rows = await prisma.report.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "desc" },
    });
    return rows.map(ReportMapper.toDomain);
  }

  async all(): Promise<Report[]> {
    const rows = await prisma.report.findMany({
      orderBy: { createdAt: "desc" },
    });
    return rows.map(ReportMapper.toDomain);
  }

  async byRequest(requestId: HelpRequestId): Promise<Report[]> {
    const rows = await prisma.report.findMany({
      where: { requestId: requestId.value },
      orderBy: { createdAt: "desc" },
    });
    return rows.map(ReportMapper.toDomain);
  }
}
