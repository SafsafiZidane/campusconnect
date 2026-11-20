export class UserId {
  private constructor(readonly value: string) {}

  static next(): UserId {
    return new UserId(crypto.randomUUID());
  }

  static from(value: string): UserId {
    if (!value || typeof value !== "string" || value.trim().length === 0) {
      throw new Error("L'identifiant utilisateur est invalide.");
    }
    return new UserId(value);
  }

  equals(other: UserId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
