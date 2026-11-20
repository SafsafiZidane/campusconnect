export class ProposalId {
  private constructor(readonly value: string) {}

  static next(): ProposalId {
    return new ProposalId(crypto.randomUUID());
  }

  static from(value: string): ProposalId {
    if (!value || typeof value !== "string" || value.trim().length === 0) {
      throw new Error("L'identifiant de la proposition est invalide.");
    }
    return new ProposalId(value);
  }

  equals(other: ProposalId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
