# CampusConnect 🎓
> **Plateforme d'entraide et de partage de compétences entre étudiants**  
> Développé avec **Next.js (App Router)**, **TypeScript**, **PostgreSQL** et structuré selon les principes stricts de la **Clean Architecture** (sans monorepo).

Projet réalisé dans le cadre du module **React & Next.js** (Enseignant : **Mohamed Amine Ben Rhouma**).

---

## 📋 Table des matières
1. [Objectifs du projet](#-objectifs-du-projet)
2. [Fonctionnalités implémentées](#-fonctionnalités-implémentées)
3. [Fonctionnalité originale : Recommandation & Badges](#-fonctionnalité-originale)
4. [Architecture du projet (Clean Architecture)](#-architecture-du-projet)
5. [Prérequis et Technologies](#-prérequis-et-technologies)
6. [Installation et Configuration](#-installation-et-configuration)
7. [Comptes de démonstration](#-comptes-de-démonstration)
8. [Tests automatisés](#-tests-automatisés)
9. [Limites connues](#-limites-connues)

---

## 🎯 Objectifs du projet
CampusConnect permet aux étudiants d'un campus de :
- Demander de l'aide sur une notion de cours, un TP ou un projet.
- Partager leurs compétences et proposer leur soutien pédagogique.
- Organiser des séances de révision individuelles ou collectives.
- Suivre le cycle de vie complet de l'entraide : **Demande ouverte** ➔ **Aide acceptée** ➔ **Séance réalisée / terminée** ➔ **Évaluation post-séance**.
- Offrir aux administrateurs un espace de modération pour traiter les publications signalées.

---

## ⚡ Fonctionnalités implémentées

| Fonctionnalité | Description |
| :--- | :--- |
| **Inscription & Profil étudiant** | Choix de la spécialité, du niveau d'études (L1 à Ingénieur 3) et des compétences maîtrisées. |
| **Publication d'une demande** | Formulaire complet : titre, description détaillée, matière, niveau et disponibilités. |
| **Recherche & Filtrage** | Filtres multi-critères par matière, niveau, statut et recherche textuelle avec persistance dans l'URL. |
| **Propositions d'aide** | Les autres étudiants peuvent soumettre leur candidature avec message et disponibilités. |
| **Sélection par l'auteur** | Seul l'auteur de la demande peut accepter ou refuser une proposition. L'acceptation clôt automatiquement les propositions concurrentes. |
| **Cycle de vie strict** | `OUVERTE` ➔ `AIDE_ACCEPTEE` (en cours) ➔ `TERMINEE` (clôturée). |
| **Évaluations certifiées** | Système de notation de 1 à 5 étoiles et commentaires, strictement réservé aux participants après la clôture. |
| **Tableau de bord personnel** | Vue centralisée en 3 volets : demandes publiées, aides proposées, séances réalisées et avis reçus. |
| **Espace administrateur** | Modération des publications signalées avec actions de suppression ou de classement sans suite. |
| **Défense en profondeur** | Règles métier et contrôles d'accès validés à la fois côté client, dans les Server Actions (Zod) et dans le Domaine pur. |

---

## 🌟 Fonctionnalité originale
### Recommandation intelligente selon les compétences & Système de Réputation
1. **Algorithme de Matching (`GetRecommendedRequestsUseCase`) :**  
   Analyse en temps réel les compétences déclarées dans le profil de l'étudiant connecté et les compare aux matières et descriptions des demandes d'aide ouvertes. Un score de compatibilité (%) et les tags correspondants sont affichés sur la page d'accueil pour susciter l'entraide proactive.
2. **Système de Badges & Points de Réputation :**  
   Chaque séance menée à bien et chaque évaluation positive rapporte des points de réputation qui débloquent dynamiquement des badges prestigieux (*Membre Campus*, *Tuteur Actif*, *Mentor Campus*, *Excellence Académique*).

---

## 🏛 Architecture du projet
Le projet applique la **Clean Architecture** dans une structure unifiée (sans monorepo) :

```text
CampusConnect/
├── src/
│   ├── domain/               # COUCHE DOMAINE (Règles métier pures, sans Prisma ni React)
│   │   ├── user/             # Entité User, UserId, Erreurs de domaine
│   │   ├── help-request/     # Entité HelpRequest, Invariants, Cycle de vie
│   │   ├── proposal/         # Entité Proposal, Invariants
│   │   ├── session-review/   # Entité SessionReview, Règles de notation
│   │   └── report/           # Entité Report, Statuts de modération
│   │
│   ├── application/          # COUCHE APPLICATION (Cas d'utilisation & Ports)
│   │   ├── ports/            # Contrats des Repositories et Services (Inversion de dépendance)
│   │   ├── use-cases/        # Orchestration métier (Auth, Requests, Proposals, Reviews, Admin)
│   │   └── common/           # Type Result<T>, Gestion des erreurs
│   │
│   ├── infrastructure/       # COUCHE INFRASTRUCTURE (Détails techniques & Adaptateurs)
│   │   ├── db/               # Client Prisma PostgreSQL
│   │   ├── repositories/     # Implémentations Prisma des ports de l'Application
│   │   ├── mappers/          # Convertisseurs Bidirectionnels Domain <-> Prisma Row
│   │   └── security/         # Bcrypt (hashage) et JWT (tokens de session)
│   │
│   ├── container/            # COMPOSITION ROOT (Point unique d'assemblage & Injection)
│   │   └── index.ts          # Instanciation des dépôts et export des useCases
│   │
│   ├── components/           # COUCHE PRÉSENTATION - COMPOSANTS UI
│   │   ├── ui/               # StatusBadge, RatingStars, EmptyState, LoadingSkeleton
│   │   ├── requests/         # RequestCard, RequestFilterBar, RecommendedBanner, Modals
│   │   ├── proposals/        # ProposalForm, ProposalList
│   │   ├── reviews/          # ReviewModal
│   │   └── admin/            # AdminReportActions
│   │
│   └── app/                  # COUCHE PRÉSENTATION - NEXT.JS APP ROUTER
│       ├── layout.tsx        # Layout principal avec Navbar et Footer
│       ├── page.tsx          # Page d'accueil avec Recommandations
│       ├── login/            # Page de connexion (avec boutons démo 1-clic)
│       ├── register/         # Inscription étudiant
│       ├── requests/         # Catalogue et recherche filtrée
│       │   ├── [id]/         # Détail d'une demande, propositions & avis
│       │   └── new/          # Formulaire de création de demande
│       ├── dashboard/        # Tableau de bord étudiant
│       ├── profile/          # Gestion du profil et des compétences
│       ├── admin/            # Espace modérateur
│       └── actions/          # Server Actions Next.js avec validation Zod aux frontières
│
├── prisma/
│   └── schema.prisma         # Schéma de la base PostgreSQL
├── scripts/
│   └── seed.mjs              # Script de peuplement des données de démonstration
├── tests/
│   └── clean-architecture.test.ts  # Suite de tests automatisés (Domaine & Use Cases)
└── ARCHITECTURE.md           # Justification détaillée des choix d'architecture
```

---

## 🛠 Prérequis et Technologies
- **Node.js** : v20+ (testé sur v24)
- **PostgreSQL** : instance locale ou distante
- **Next.js** 14.2+ (App Router, Server Components & Server Actions)
- **Prisma ORM** : mapping et migrations PostgreSQL
- **Tailwind CSS** : interface responsive et accessible
- **Zod** : validation aux frontières
- **TypeScript** : typage strict de bout en bout

---

## 🚀 Installation et Configuration

### 1. Cloner ou ouvrir le dossier du projet
```bash
cd CampusConnect
```

### 2. Configurer les variables d'environnement
Créez ou vérifiez le fichier `.env` à la racine :
```env
# Connexion à votre instance PostgreSQL locale
DATABASE_URL="postgresql://postgres:zidane@localhost:5432/campusconnect?schema=public"

# Clé secrète de signature JWT
JWT_SECRET="campusconnect-jwt-secret-key-development-2026-very-secure"

# URL publique
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Synchroniser le schéma PostgreSQL avec Prisma
```bash
npx prisma db push
```

### 4. Peupler la base avec les données de démonstration
```bash
npm run db:seed
```

### 5. Démarrer le serveur de développement
```bash
npm run dev
```
Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

---

## 👥 Comptes de démonstration

Pour tester immédiatement tous les parcours sans saisie fastidieuse, des **boutons de remplissage automatique en 1 clic** sont disponibles sur la page `/login` :

| Compte | Email | Mot de passe | Rôle | Profil / Spécialité |
| :--- | :--- | :--- | :--- | :--- |
| **Alice Dubois** | `alice@campus.fr` | `password123` | Étudiante | L3 Informatique, demandeuse d'aide et contributrice |
| **Karim Ben Salah**| `karim@campus.fr` | `password123` | Étudiant | M1 Génie Logiciel, tuteur régulier (Mentor Campus) |
| **Sarah Mansour**  | `sarah@campus.fr` | `password123` | Étudiante | L2 Mathématiques, tutrice en calcul et algèbre |
| **Admin Campus**   | `admin@campus.fr` | `admin123` | Administrateur | Modération de l'espace `/admin` |

---

## 🧪 Tests automatisés
La suite de tests vérifie l'intégrité des règles métier du domaine et l'orchestration des cas d'utilisation avec des *Fakes* en mémoire (sans appel réseau ni base de données, s'exécutant en quelques millisecondes) :

```bash
npm test
```

Résultats vérifiés :
- Invariants du domaine (titre trop court, refus d'auto-proposition).
- Seul l'auteur peut modifier ou accepter une demande.
- Cycle de vie complet (`OPEN` ➔ `ACCEPTED` ➔ `COMPLETED`).
- Rejet automatique des propositions concurrentes lors de l'acceptation d'un tuteur.
- Borne stricte des notes (1 à 5).
- Attribution automatique de points et badges.
- Algorithme de recommandation par compétences.

---

## ⚠️ Limites connues
1. **Notifications en direct :** Les mises à jour de statut reposent sur `revalidatePath` et la navigation serveur Next.js. Une intégration WebSocket ou Server-Sent Events (SSE) permettrait des alertes sonores ou notifications push en temps réel.
2. **Messagerie instantanée :** Les propositions permettent d'échanger des messages et disponibilités pour convenir d'un rendez-vous (en présentiel ou Discord/Teams), mais un chat textuel synchrone temps-réel pourrait enrichir les futures versions.
