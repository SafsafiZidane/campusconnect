import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Début du peuplement de la base de données PostgreSQL pour CampusConnect...");

  // Clear existing data
  await prisma.report.deleteMany();
  await prisma.sessionReview.deleteMany();
  await prisma.proposal.deleteMany();
  await prisma.helpRequest.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("password123", 10);
  const adminPasswordHash = await bcrypt.hash("admin123", 10);

  // 1. Create Users
  const alice = await prisma.user.create({
    data: {
      name: "Alice Dubois",
      email: "alice@campus.fr",
      password: passwordHash,
      role: "STUDENT",
      speciality: "Informatique",
      level: "Licence 3",
      skills: "Algorithmique & C, Python, Structures de données",
      bio: "Étudiante en L3 passionnée par l'algorithmique et l'optimisation de code.",
      reputationPoints: 45,
      badges: "Membre Campus, Tuteur Actif",
    },
  });

  const karim = await prisma.user.create({
    data: {
      name: "Karim Ben Salah",
      email: "karim@campus.fr",
      password: passwordHash,
      role: "STUDENT",
      speciality: "Génie Logiciel",
      level: "Master 1",
      skills: "Développement Web & React, TypeScript, Next.js, Bases de Données & SQL",
      bio: "Étudiant en M1 Génie Logiciel, tuteur régulier en développement web et architectures propres.",
      reputationPoints: 85,
      badges: "Membre Campus, Tuteur Actif, Mentor Campus",
    },
  });

  const sarah = await prisma.user.create({
    data: {
      name: "Sarah Mansour",
      email: "sarah@campus.fr",
      password: passwordHash,
      role: "STUDENT",
      speciality: "Mathématiques",
      level: "Licence 2",
      skills: "Mathématiques & Algèbre, Probabilités, Statistiques",
      bio: "En L2 Maths fondamentales, ravie d'aider en calcul et algèbre linéaire.",
      reputationPoints: 35,
      badges: "Membre Campus, Tuteur Actif",
    },
  });

  const admin = await prisma.user.create({
    data: {
      name: "Admin Campus",
      email: "admin@campus.fr",
      password: adminPasswordHash,
      role: "ADMIN",
      speciality: "Administration",
      level: "Superviseur",
      skills: "Modération, Administration",
      bio: "Responsable de la modération et de la sécurité des échanges académiques sur CampusConnect.",
      reputationPoints: 100,
      badges: "Administrateur, Modérateur Officiel",
    },
  });

  console.log("✅ 4 utilisateurs créés (Alice, Karim, Sarah, Admin).");

  // 2. Create Help Requests

  // Request 1: OPEN
  const req1 = await prisma.helpRequest.create({
    data: {
      title: "Comprendre les arbres binaires de recherche (ABR) et le parcours en largeur (BFS)",
      description:
        "J'ai des difficultés sur le TP de structures de données en C concernant l'insertion récursive dans un ABR et le parcours BFS avec une file d'attente. Besoin d'un camarade pour m'expliquer le principe.",
      subject: "Algorithmique & C",
      level: "Licence 2",
      availability: "Mercredi après-midi à partir de 15h (BU ou Discord)",
      status: "OPEN",
      authorId: alice.id,
    },
  });

  // Request 2: ACCEPTED
  const req2 = await prisma.helpRequest.create({
    data: {
      title: "Aide pour concevoir une application avec Clean Architecture et Next.js App Router",
      description:
        "Besoin de clarifier la séparation des couches Domain, Application et Infrastructure, et comment injecter les ports dans le container sans coupler le domaine à Prisma.",
      subject: "Développement Web & React",
      level: "Master 1",
      availability: "Jeudi 18h en ligne",
      status: "ACCEPTED",
      authorId: sarah.id,
      selectedHelperId: karim.id,
    },
  });

  // Request 3: COMPLETED
  const req3 = await prisma.helpRequest.create({
    data: {
      title: "Révision des intégrales multiples et théorèmes de Stokes / Gauss",
      description:
        "Séance de préparation pour le partiel d'analyse mathématique. Exercices types sur le calcul d'intégrales doubles et triples.",
      subject: "Mathématiques & Algèbre",
      level: "Licence 1",
      availability: "Samedi matin 10h",
      status: "COMPLETED",
      authorId: alice.id,
      selectedHelperId: sarah.id,
    },
  });

  // Request 4: OPEN
  const req4 = await prisma.helpRequest.create({
    data: {
      title: "Optimisation de requêtes SQL volumineuses et compréhension des plans d'exécution EXPLAIN",
      description:
        "Je prépare le module de bases de données avancées et je souhaite comprendre comment analyser un plan d'exécution PostgreSQL, indexer les colonnes composées et éviter les Sequential Scans.",
      subject: "Bases de Données & SQL",
      level: "Licence 3",
      availability: "Vendredi après 16h",
      status: "OPEN",
      authorId: karim.id,
    },
  });

  // Request 5: Reported publication for Admin
  const req5 = await prisma.helpRequest.create({
    data: {
      title: "Vente de corrigés officiels d'examens et annales payantes",
      description:
        "Contactez-moi sur Telegram pour acheter les corrigés des examens finaux de l'université à 20 euros.",
      subject: "Autre matière",
      level: "Licence 1",
      availability: "Immédiate",
      status: "OPEN",
      isReported: true,
      authorId: alice.id,
    },
  });

  console.log("✅ 5 demandes d'aide créées (3 ouvertes, 1 acceptée, 1 terminée).");

  // 3. Create Proposals
  await prisma.proposal.create({
    data: {
      message:
        "Salut Alice ! J'ai déjà validé ce module avec 17/20, je peux t'expliquer pas à pas l'implémentation de la file et l'arbre binaire avec des schémas très clairs.",
      proposedAvailability: "Mercredi à 15h30 à la bibliothèque",
      status: "PENDING",
      requestId: req1.id,
      helperId: karim.id,
    },
  });

  await prisma.proposal.create({
    data: {
      message:
        "Bonjour Sarah ! Je maîtrise Clean Architecture sur le bout des doigts avec TypeScript et Next.js. On peut faire une session pour poser les diagrammes et le conteneur d'injection.",
      proposedAvailability: "Jeudi 18h sur Discord",
      status: "ACCEPTED",
      requestId: req2.id,
      helperId: karim.id,
    },
  });

  console.log("✅ 2 propositions créées.");

  // 4. Create Session Review on completed request
  await prisma.sessionReview.create({
    data: {
      rating: 5,
      comment:
        "Séance de révision exceptionnelle ! Sarah a su rendre les théorèmes de Stokes et Green limpides avec des exemples géométriques. Je me sens prête pour l'examen !",
      requestId: req3.id,
      reviewerId: alice.id,
      revieweeId: sarah.id,
    },
  });

  console.log("✅ 1 avis 5 étoiles enregistré.");

  // 5. Create Report for Admin moderation
  await prisma.report.create({
    data: {
      reason: "Fraude académique ou triche",
      details:
        "Cette publication propose la vente illégale de corrigés d'examens, ce qui est strictement contraire à la charte de CampusConnect et au règlement des études.",
      status: "PENDING",
      requestId: req5.id,
      reporterId: karim.id,
    },
  });

  console.log("✅ 1 signalement en attente pour l'espace administrateur.");

  console.log("\n🎉 Peuplement terminé avec succès ! Base de données prête.");
}

main()
  .catch((e) => {
    console.error("Erreur de peuplement :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
