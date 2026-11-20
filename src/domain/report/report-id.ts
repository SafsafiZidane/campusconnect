export class ReportId {
  private constructor(readonly value: string) {}

  static next(): ReportId {
    return new ReportId(crypto.randomUUID());
  }

  static from(value: string): ReportId {
    if (!value || typeof value !== "string" || value.trim().length === 0) {
      throw new Error("L'identifiant de signalement est invalide.");
    }
    return new ReportId(value);
  }

  equals(other: ReportId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
