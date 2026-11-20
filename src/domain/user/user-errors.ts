export class DomainError extends Error {
  constructor(
    public readonly code: string,
    message: string
  ) {
    super(message);
    this.name = "DomainError";
  }
}

export class EmailInvalideError extends DomainError {
  constructor(email: string) {
    super("EMAIL_INVALIDE", `L'adresse email '${email}' n'est pas valide.`);
  }
}

export class NomTropCourtError extends DomainError {
  constructor(name: string) {
    super("NOM_TROP_COURT", `Le nom '${name}' doit contenir au moins 2 caractères.`);
  }
}

export class MotDePasseTropFaibleError extends DomainError {
  constructor() {
    super("MOT_DE_PASSE_TROP_FAIBLE", "Le mot de passe doit comporter au moins 6 caractères.");
  }
}

export class UtilisateurIntrouvableError extends DomainError {
  constructor(identifier: string) {
    super("UTILISATEUR_INTROUVABLE", `Utilisateur introuvable pour '${identifier}'.`);
  }
}

export class EmailDejaUtiliseError extends DomainError {
  constructor(email: string) {
    super("EMAIL_DEJA_UTILISE", `Un compte existe déjà avec l'adresse email '${email}'.`);
  }
}

export class IdentifiantsInvalidesError extends DomainError {
  constructor() {
    super("IDENTIFIANTS_INVALIDES", "Email ou mot de passe incorrect.");
  }
}
