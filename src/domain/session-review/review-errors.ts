import { DomainError } from "../user/user-errors";

export class NoteInvalideError extends DomainError {
  constructor() {
    super("NOTE_INVALIDE", "La note de l'évaluation doit être comprise entre 1 et 5 étoiles.");
  }
}

export class CommentaireTropCourtError extends DomainError {
  constructor() {
    super("COMMENTAIRE_TROP_COURT", "Le commentaire doit comporter au moins 3 caractères.");
  }
}

export class EvaluationNonAutoriseeError extends DomainError {
  constructor(message = "L'évaluation est autorisée uniquement aux participants après la clôture de la séance.") {
    super("EVALUATION_NON_AUTORISEE", message);
  }
}

export class EvaluationDejaDonneeError extends DomainError {
  constructor() {
    super("EVALUATION_DEJA_DONNEE", "Vous avez déjà évalué cette séance.");
  }
}
