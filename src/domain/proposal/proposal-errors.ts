import { DomainError } from "../user/user-errors";

export class MessagePropositionTropCourtError extends DomainError {
  constructor() {
    super("MESSAGE_PROPOSITION_TROP_COURT", "Le message de proposition doit comporter au moins 5 caractères.");
  }
}

export class PropositionIntrouvableError extends DomainError {
  constructor(id: string) {
    super("PROPOSITION_INTROUVABLE", `La proposition '${id}' n'a pas été trouvée.`);
  }
}

export class PropositionDejaTraiteeError extends DomainError {
  constructor() {
    super("PROPOSITION_DEJA_TRAITEE", "Cette proposition a déjà été acceptée ou refusée.");
  }
}
