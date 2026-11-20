import assert from "node:assert/strict";
import { User } from "../src/domain/user/user";
import { UserId } from "../src/domain/user/user-id";
import { HelpRequest } from "../src/domain/help-request/help-request";
import { HelpRequestId } from "../src/domain/help-request/help-request-id";
import { Proposal } from "../src/domain/proposal/proposal";
import { ProposalId } from "../src/domain/proposal/proposal-id";
import { SessionReview } from "../src/domain/session-review/session-review";
import {
  TitreDemandeInvalideError,
  ActionNonAutoriseeError,
} from "../src/domain/help-request/help-request-errors";
import { NoteInvalideError } from "../src/domain/session-review/review-errors";

// Use cases and in-memory fakes
import { CreateHelpRequestUseCase } from "../src/application/use-cases/help-request/create-help-request.use-case";
import { SubmitProposalUseCase } from "../src/application/use-cases/proposal/submit-proposal.use-case";
import { AcceptProposalUseCase } from "../src/application/use-cases/proposal/accept-proposal.use-case";
import { GetRecommendedRequestsUseCase } from "../src/application/use-cases/help-request/get-recommended-requests.use-case";
import { HelpRequestRepository, HelpRequestFilters } from "../src/application/ports/help-request-repository.port";
import { UserRepository } from "../src/application/ports/user-repository.port";
import { ProposalRepository } from "../src/application/ports/proposal-repository.port";

// In-Memory Fakes
class FakeUserRepository implements UserRepository {
  users: Map<string, User> = new Map();

  async save(user: User): Promise<void> {
    this.users.set(user.id.value, user);
  }
  async byId(id: UserId): Promise<User | null> {
    return this.users.get(id.value) || null;
  }
  async byEmail(email: string): Promise<User | null> {
    for (const u of this.users.values()) {
      if (u.snapshot().email.toLowerCase() === email.toLowerCase()) return u;
    }
    return null;
  }
  async all(): Promise<User[]> {
    return Array.from(this.users.values());
  }
}

class FakeHelpRequestRepository implements HelpRequestRepository {
  requests: Map<string, HelpRequest> = new Map();

  async save(request: HelpRequest): Promise<void> {
    this.requests.set(request.id.value, request);
  }
  async byId(id: HelpRequestId): Promise<HelpRequest | null> {
    return this.requests.get(id.value) || null;
  }
  async all(filters?: HelpRequestFilters): Promise<HelpRequest[]> {
    let list = Array.from(this.requests.values());
    if (filters?.status) {
      list = list.filter((r) => r.snapshot().status === filters.status);
    }
    return list;
  }
  async byAuthor(authorId: UserId): Promise<HelpRequest[]> {
    return Array.from(this.requests.values()).filter(
      (r) => r.snapshot().authorId === authorId.value
    );
  }
  async byAssignedHelper(helperId: UserId): Promise<HelpRequest[]> {
    return Array.from(this.requests.values()).filter(
      (r) => r.snapshot().selectedHelperId === helperId.value
    );
  }
  async allReported(): Promise<HelpRequest[]> {
    return Array.from(this.requests.values()).filter((r) => r.snapshot().isReported);
  }
  async delete(id: HelpRequestId): Promise<void> {
    this.requests.delete(id.value);
  }
}

class FakeProposalRepository implements ProposalRepository {
  proposals: Map<string, Proposal> = new Map();

  async save(proposal: Proposal): Promise<void> {
    this.proposals.set(proposal.id.value, proposal);
  }
  async byId(id: ProposalId): Promise<Proposal | null> {
    return this.proposals.get(id.value) || null;
  }
  async byRequest(requestId: HelpRequestId): Promise<Proposal[]> {
    return Array.from(this.proposals.values()).filter(
      (p) => p.snapshot().requestId === requestId.value
    );
  }
  async byHelper(helperId: UserId): Promise<Proposal[]> {
    return Array.from(this.proposals.values()).filter(
      (p) => p.snapshot().helperId === helperId.value
    );
  }
  async rejectOtherPendingProposals(
    requestId: HelpRequestId,
    exceptProposalId: ProposalId
  ): Promise<void> {
    for (const p of this.proposals.values()) {
      if (
        p.snapshot().requestId === requestId.value &&
        p.id.value !== exceptProposalId.value &&
        p.isPending()
      ) {
        p.reject();
      }
    }
  }
}

async function runTests() {
  console.log("🚀 Lancement des tests de Clean Architecture (Domaine & Cas d'utilisation)...\n");

  let passed = 0;

  // TEST 1: Domain Invariant - Titre trop court
  {
    assert.throws(
      () => {
        HelpRequest.create({
          title: "Abc", // Trop court (< 5)
          description: "Description valide de plus de dix caractères",
          subject: "Algorithmique",
          level: "Licence 2",
          availability: "Mardi 14h",
          authorId: UserId.next(),
        });
      },
      (err: any) => err instanceof TitreDemandeInvalideError,
      "Le domaine doit rejeter un titre de moins de 5 caractères"
    );
    console.log("✔ Test 1: Invariant Domaine - Titre trop court rejeté");
    passed++;
  }

  // TEST 2: Domain Invariant - Seul l'auteur peut modifier la demande
  {
    const authorId = UserId.next();
    const otherStudentId = UserId.next();

    const request = HelpRequest.create({
      title: "Comprendre les arbres binaires et BFS",
      description: "Description valide de plus de dix caractères",
      subject: "Algorithmique",
      level: "Licence 2",
      availability: "Mardi 14h",
      authorId,
    });

    assert.throws(
      () => {
        request.modify(otherStudentId, { title: "Nouveau titre piraté" });
      },
      (err: any) => err instanceof ActionNonAutoriseeError,
      "Seul l'auteur peut modifier sa propre demande"
    );
    console.log("✔ Test 2: Invariant Domaine - Seul l'auteur peut modifier sa demande");
    passed++;
  }

  // TEST 3: Domain Workflow - Cycle de vie OUVERTE -> ACCEPTEE -> TERMINEE
  {
    const authorId = UserId.next();
    const helperId = UserId.next();

    const request = HelpRequest.create({
      title: "Comprendre les bases de données SQL",
      description: "Description valide de plus de dix caractères",
      subject: "SQL",
      level: "Licence 3",
      availability: "Jeudi 16h",
      authorId,
    });

    assert.equal(request.snapshot().status, "OPEN");
    assert.equal(request.canReceiveProposals(), true);

    // Accept proposal
    request.acceptProposal(authorId, helperId);
    assert.equal(request.snapshot().status, "ACCEPTED");
    assert.equal(request.canReceiveProposals(), false);
    assert.equal(request.snapshot().selectedHelperId, helperId.value);

    // Complete session
    request.completeSession(authorId);
    assert.equal(request.snapshot().status, "COMPLETED");
    assert.equal(request.isCompleted(), true);
    console.log("✔ Test 3: Cycle de vie de la demande (OPEN -> ACCEPTED -> COMPLETED)");
    passed++;
  }

  // TEST 4: Domain Invariant - Note d'évaluation comprise entre 1 et 5
  {
    assert.throws(
      () => {
        SessionReview.create({
          rating: 6, // Invalide (> 5)
          comment: "Super séance",
          requestId: HelpRequestId.next(),
          reviewerId: UserId.next(),
          revieweeId: UserId.next(),
        });
      },
      (err: any) => err instanceof NoteInvalideError,
      "La note doit être comprise entre 1 et 5"
    );
    console.log("✔ Test 4: Invariant Domaine - Note d'évaluation bornée entre 1 et 5");
    passed++;
  }

  // TEST 5: Domain - Système de réputation et badges
  {
    const student = User.createStudent({
      name: "Jean Dupont",
      email: "jean@campus.fr",
      passwordHash: "hash123456",
      speciality: "Informatique",
      level: "Licence 3",
      skills: ["React", "TypeScript"],
    });

    assert.equal(student.snapshot().reputationPoints, 10);
    assert.deepEqual(student.snapshot().badges, ["Membre Campus"]);

    // Complete sessions with 5 stars
    student.awardHelpCompletedPoints(5); // + 15 + 10 = +25 pts -> 35 pts
    assert.equal(student.snapshot().reputationPoints, 35);
    assert.ok(student.snapshot().badges.includes("Tuteur Actif"));

    student.awardHelpCompletedPoints(5); // + 25 -> 60 pts
    assert.ok(student.snapshot().badges.includes("Mentor Campus"));
    console.log("✔ Test 5: Domaine - Attribution dynamique de réputation et badges");
    passed++;
  }

  // TEST 6: Use Case - CreateHelpRequestUseCase avec Fake Repository
  {
    const userRepo = new FakeUserRepository();
    const reqRepo = new FakeHelpRequestRepository();

    const student = User.createStudent({
      name: "Leila",
      email: "leila@campus.fr",
      passwordHash: "hash123456",
      speciality: "Génie Logiciel",
      level: "Master 1",
      skills: ["Java"],
    });
    await userRepo.save(student);

    const useCase = new CreateHelpRequestUseCase(reqRepo, userRepo);
    const result = await useCase.execute({
      title: "Révisions sur les design patterns en Java",
      description: "Besoin d'aide pour le pattern Observer et Factory",
      subject: "Génie Logiciel",
      level: "Master 1",
      availability: "Lundi 14h",
      authorId: student.id.value,
    });

    assert.equal(result.ok, true);
    if (result.ok) {
      const created = await reqRepo.byId(HelpRequestId.from(result.value.id));
      assert.ok(created);
      assert.equal(created?.snapshot().title, "Révisions sur les design patterns en Java");
    }
    console.log("✔ Test 6: Cas d'utilisation CreateHelpRequestUseCase (avec repository en mémoire)");
    passed++;
  }

  // TEST 7: Use Case - AcceptProposal rejette automatiquement les autres propositions
  {
    const userRepo = new FakeUserRepository();
    const reqRepo = new FakeHelpRequestRepository();
    const propRepo = new FakeProposalRepository();

    const author = User.createStudent({
      name: "Alice",
      email: "alice@campus.fr",
      passwordHash: "hash123456",
      speciality: "Informatique",
      level: "L3",
      skills: ["C"],
    });
    const helper1 = User.createStudent({
      name: "Karim",
      email: "karim@campus.fr",
      passwordHash: "hash123456",
      speciality: "Informatique",
      level: "M1",
      skills: ["C"],
    });
    const helper2 = User.createStudent({
      name: "Sarah",
      email: "sarah@campus.fr",
      passwordHash: "hash123456",
      speciality: "Informatique",
      level: "M2",
      skills: ["C"],
    });

    await userRepo.save(author);
    await userRepo.save(helper1);
    await userRepo.save(helper2);

    const request = HelpRequest.create({
      title: "Pointeurs et mémoire dynamique en C",
      description: "Segmentation fault sur mon allocation malloc",
      subject: "C",
      level: "L2",
      availability: "Demain 10h",
      authorId: author.id,
    });
    await reqRepo.save(request);

    const prop1 = Proposal.create({
      requestId: request.id,
      helperId: helper1.id,
      message: "Je peux t'aider avec Valgrind !",
    });
    const prop2 = Proposal.create({
      requestId: request.id,
      helperId: helper2.id,
      message: "Disponible aussi pour t'expliquer les pointeurs.",
    });
    await propRepo.save(prop1);
    await propRepo.save(prop2);

    const acceptUseCase = new AcceptProposalUseCase(propRepo, reqRepo, userRepo);
    const acceptRes = await acceptUseCase.execute(prop1.id.value, author.id.value);

    assert.equal(acceptRes.ok, true);

    const p1Updated = await propRepo.byId(prop1.id);
    const p2Updated = await propRepo.byId(prop2.id);

    assert.equal(p1Updated?.snapshot().status, "ACCEPTED");
    assert.equal(p2Updated?.snapshot().status, "REJECTED"); // Rejeté automatiquement !
    console.log("✔ Test 7: Cas d'utilisation AcceptProposalUseCase (clôture des offres concurrentes)");
    passed++;
  }

  // TEST 8: Feature Originale - Recommandation intelligente selon les compétences de l'étudiant
  {
    const userRepo = new FakeUserRepository();
    const reqRepo = new FakeHelpRequestRepository();
    const propRepo = new FakeProposalRepository();

    const studentExpert = User.createStudent({
      name: "Expert Python",
      email: "expert@campus.fr",
      passwordHash: "hash123456",
      speciality: "Informatique",
      level: "Master 2",
      skills: ["Python", "FastAPI", "Machine Learning"],
    });
    await userRepo.save(studentExpert);

    const reqPython = HelpRequest.create({
      title: "Débogage script Python et API FastAPI",
      description: "Erreur 500 sur mon endpoint asynchrone Python",
      subject: "Informatique",
      level: "L3",
      availability: "Ce soir",
      authorId: UserId.next(),
    });

    const reqCivil = HelpRequest.create({
      title: "Calcul de résistance des matériaux en béton armé",
      description: "Moments fléchissants et dimensionnement de poutre",
      subject: "Génie Civil",
      level: "Ingénieur 1",
      availability: "Lundi",
      authorId: UserId.next(),
    });

    await reqRepo.save(reqPython);
    await reqRepo.save(reqCivil);

    const recUseCase = new GetRecommendedRequestsUseCase(reqRepo, userRepo, propRepo);
    const recResult = await recUseCase.execute(studentExpert.id.value);

    assert.equal(recResult.ok, true);
    if (recResult.ok) {
      assert.equal(recResult.value.length, 1);
      assert.equal(recResult.value[0].title, "Débogage script Python et API FastAPI");
      assert.ok(recResult.value[0].matchScore > 50);
      assert.ok(recResult.value[0].matchingSkills.includes("python"));
    }
    console.log("✔ Test 8: Fonctionnalité originale - Recommandation IA & matching par compétences");
    passed++;
  }

  console.log(`\n🎉 Tous les tests (${passed}/${passed}) ont réussi avec succès en quelques millisecondes !`);
}

runTests().catch((err) => {
  console.error("Échec des tests :", err);
  process.exit(1);
});
