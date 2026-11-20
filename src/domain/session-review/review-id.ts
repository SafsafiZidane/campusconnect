export class ReviewId {
  private constructor(readonly value: string) {}

  static next(): ReviewId {
    return new ReviewId(crypto.randomUUID());
  }

  static from(value: string): ReviewId {
    if (!value || typeof value !== "string" || value.trim().length === 0) {
      throw new Error("L'identifiant de l'évaluation est invalide.");
    }
    return new ReviewId(value);
  }

  equals(other: ReviewId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
