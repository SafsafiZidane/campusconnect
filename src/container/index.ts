import { PrismaUserRepository } from "../infrastructure/repositories/prisma-user-repository";
import { PrismaHelpRequestRepository } from "../infrastructure/repositories/prisma-help-request-repository";
import { PrismaProposalRepository } from "../infrastructure/repositories/prisma-proposal-repository";
import { PrismaSessionReviewRepository } from "../infrastructure/repositories/prisma-session-review-repository";
import { PrismaReportRepository } from "../infrastructure/repositories/prisma-report-repository";
import { BcryptPasswordHasher } from "../infrastructure/security/bcrypt-password-hasher";
import { JwtTokenService } from "../infrastructure/security/jwt-token-service";

// Auth use cases
import { RegisterStudentUseCase } from "../application/use-cases/auth/register-student.use-case";
import { LoginUserUseCase } from "../application/use-cases/auth/login-user.use-case";
import { GetCurrentUserUseCase } from "../application/use-cases/auth/get-current-user.use-case";

// Student use cases
import { UpdateProfileUseCase } from "../application/use-cases/student/update-profile.use-case";
import { GetStudentDashboardUseCase } from "../application/use-cases/student/get-student-dashboard.use-case";

// Help Request use cases
import { CreateHelpRequestUseCase } from "../application/use-cases/help-request/create-help-request.use-case";
import { ListHelpRequestsUseCase } from "../application/use-cases/help-request/list-help-requests.use-case";
import { GetHelpRequestByIdUseCase } from "../application/use-cases/help-request/get-help-request-by-id.use-case";
import { UpdateHelpRequestUseCase } from "../application/use-cases/help-request/update-help-request.use-case";
import { CompleteHelpRequestUseCase } from "../application/use-cases/help-request/complete-help-request.use-case";
import { GetRecommendedRequestsUseCase } from "../application/use-cases/help-request/get-recommended-requests.use-case";

// Proposal use cases
import { SubmitProposalUseCase } from "../application/use-cases/proposal/submit-proposal.use-case";
import { AcceptProposalUseCase } from "../application/use-cases/proposal/accept-proposal.use-case";
import { RejectProposalUseCase } from "../application/use-cases/proposal/reject-proposal.use-case";

// Review use cases
import { CreateSessionReviewUseCase } from "../application/use-cases/review/create-session-review.use-case";

// Admin use cases
import { ReportPublicationUseCase } from "../application/use-cases/admin/report-publication.use-case";
import { ListReportedPublicationsUseCase } from "../application/use-cases/admin/list-reported-publications.use-case";
import { ResolveReportUseCase } from "../application/use-cases/admin/resolve-report.use-case";
import { ListAllUsersUseCase } from "../application/use-cases/admin/list-all-users.use-case";
import { DeleteUserUseCase } from "../application/use-cases/admin/delete-user.use-case";
import { ListAllPublicationsUseCase } from "../application/use-cases/admin/list-all-publications.use-case";
import { AdminDeletePublicationUseCase } from "../application/use-cases/admin/admin-delete-publication.use-case";

// 1. Instantiating infrastructure adapters
const userRepository = new PrismaUserRepository();
const helpRequestRepository = new PrismaHelpRequestRepository();
const proposalRepository = new PrismaProposalRepository();
const reviewRepository = new PrismaSessionReviewRepository();
const reportRepository = new PrismaReportRepository();

const passwordHasher = new BcryptPasswordHasher();
const tokenService = new JwtTokenService();

// 2. Composition root: assembling use cases with injected dependencies
export const useCases = {
  // Auth
  registerStudent: new RegisterStudentUseCase(userRepository, passwordHasher, tokenService),
  loginUser: new LoginUserUseCase(userRepository, passwordHasher, tokenService),
  getCurrentUser: new GetCurrentUserUseCase(userRepository, tokenService),

  // Profile & Dashboard
  updateProfile: new UpdateProfileUseCase(userRepository),
  getStudentDashboard: new GetStudentDashboardUseCase(
    userRepository,
    helpRequestRepository,
    proposalRepository,
    reviewRepository
  ),

  // Help Requests
  createHelpRequest: new CreateHelpRequestUseCase(helpRequestRepository, userRepository),
  listHelpRequests: new ListHelpRequestsUseCase(
    helpRequestRepository,
    userRepository,
    proposalRepository
  ),
  getHelpRequestById: new GetHelpRequestByIdUseCase(
    helpRequestRepository,
    userRepository,
    proposalRepository,
    reviewRepository
  ),
  updateHelpRequest: new UpdateHelpRequestUseCase(helpRequestRepository),
  completeHelpRequest: new CompleteHelpRequestUseCase(helpRequestRepository),
  getRecommendedRequests: new GetRecommendedRequestsUseCase(
    helpRequestRepository,
    userRepository,
    proposalRepository
  ),

  // Proposals
  submitProposal: new SubmitProposalUseCase(proposalRepository, helpRequestRepository, userRepository),
  acceptProposal: new AcceptProposalUseCase(proposalRepository, helpRequestRepository, userRepository),
  rejectProposal: new RejectProposalUseCase(proposalRepository, helpRequestRepository),

  // Reviews
  createSessionReview: new CreateSessionReviewUseCase(
    reviewRepository,
    helpRequestRepository,
    userRepository
  ),

  // Admin
  reportPublication: new ReportPublicationUseCase(reportRepository, helpRequestRepository),
  listReportedPublications: new ListReportedPublicationsUseCase(
    reportRepository,
    helpRequestRepository,
    userRepository
  ),
  resolveReport: new ResolveReportUseCase(reportRepository, helpRequestRepository, userRepository),
  listAllUsers: new ListAllUsersUseCase(userRepository, helpRequestRepository, proposalRepository),
  deleteUser: new DeleteUserUseCase(userRepository),
  listAllPublications: new ListAllPublicationsUseCase(helpRequestRepository, userRepository, proposalRepository),
  adminDeletePublication: new AdminDeletePublicationUseCase(helpRequestRepository, userRepository),
};
