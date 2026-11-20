import { DomainError } from "../user/user-errors";

export class TitreDemandeInvalideError extends DomainError {
  constructor() {
    super("TITRE_DEMANDE_INVALIDE", "Le titre de la demande doit comporter au moins 5 caractères.");
  }
}

export class DescriptionDemandeInvalideError extends DomainError {
  constructor() {
    super("DESCRIPTION_DEMANDE_INVALIDE", "La description doit comporter au moins 10 caractères.");
  }
}

export class ChampsObligatoiresManquantsError extends DomainError {
  constructor(champs: string) {
    super("CHAMPS_MANQUANTS", `Les champs suivants sont obligatoires : ${champs}.`);
  }
}

export class DemandeIntrouvableError extends DomainError {
  constructor(id: string) {
    super("DEMANDE_INTROUVABLE", `La demande d'aide '${id}' n'a pas été trouvée.`);
  }
}

export class ActionNonAutoriseeError extends DomainError {
  constructor(message = "Vous n'êtes pas autorisé à effectuer cette action.") {
    super("ACTION_NON_AUTORISEE", message);
  }
}

export class DemandeDejaClotureeError extends DomainError {
  constructor() {
    super("DEMANDE_DEJA_CLOTUREE", "Cette demande est clôturée et ne peut plus être modifiée ni recevoir de propositions.");
  }
}

export class DemandePasEnCoursError extends DomainError {
  constructor() {
    super("DEMANDE_PAS_EN_COURS", "Seule une demande au statut 'Aide acceptée' peut être marquée comme terminée.");
  }
}

export class AutoPropositionInterditeError extends DomainError {
  constructor() {
    super("AUTO_PROPOSITION_INTERDITE", "L'auteur ne peut pas proposer son aide sur sa propre demande.");
  }
}
