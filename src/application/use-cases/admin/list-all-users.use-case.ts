import { UserRepository } from "../../ports/user-repository.port";
import { HelpRequestRepository } from "../../ports/help-request-repository.port";
import { ProposalRepository } from "../../ports/proposal-repository.port";
import { UserId } from "../../../domain/user/user-id";
import { ActionNonAutoriseeError } from "../../../domain/help-request/help-request-errors";
import { Result, ok, fail } from "../../common/result";

export interface AdminUserDTO {
  id: string;
  email: string;
  name: string;
  role: string;
  speciality: string;
  level: string;
  skills: string[];
  reputationPoints: number;
  badges: string[];
  createdAt: Date;
}

export class ListAllUsersUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly helpRequestRepository: HelpRequestRepository,
    private readonly proposalRepository: ProposalRepository
  ) {}

  async execute(adminUserIdString: string): Promise<Result<AdminUserDTO[]>> {
    try {
      const adminId = UserId.from(adminUserIdString);
      const admin = await this.userRepository.byId(adminId);
      if (!admin || !admin.isAdmin()) {
        throw new ActionNonAutoriseeError("Accès réservé aux administrateurs.");
      }

      const users = await this.userRepository.all();

      const list: AdminUserDTO[] = users.map((user) => {
        const snap = user.snapshot();
        return {
          id: snap.id,
          email: snap.email,
          name: snap.name,
          role: snap.role,
          speciality: snap.speciality,
          level: snap.level,
          skills: snap.skills,
          reputationPoints: snap.reputationPoints,
          badges: snap.badges,
          createdAt: snap.createdAt,
        };
      });

      return ok(list);
    } catch (e: unknown) {
      if (e instanceof Error) {
        return fail("ACCES_REFUSE", e.message);
      }
      return fail("ERREUR_INCONNUE", "Impossible de récupérer la liste des utilisateurs.");
    }
  }
}
