import { DomainError } from "../user/user-errors";

export class MotifSignalementRequisError extends DomainError {
  constructor() {
    super("MOTIF_SIGNALEMENT_REQUIS", "Le motif du signalement est obligatoire (au moins 5 caractères).");
  }
}

export class SignalementIntrouvableError extends DomainError {
  constructor(id: string) {
    super("SIGNALEMENT_INTROUVABLE", `Le signalement '${id}' est introuvable.`);
  }
}
