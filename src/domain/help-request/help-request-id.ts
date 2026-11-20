export class HelpRequestId {
  private constructor(readonly value: string) {}

  static next(): HelpRequestId {
    return new HelpRequestId(crypto.randomUUID());
  }

  static from(value: string): HelpRequestId {
    if (!value || typeof value !== "string" || value.trim().length === 0) {
      throw new Error("L'identifiant de demande d'aide est invalide.");
    }
    return new HelpRequestId(value);
  }

  equals(other: HelpRequestId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
