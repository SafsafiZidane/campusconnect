import { HelpRequest, HelpRequestStatus } from "../../domain/help-request/help-request";
import { HelpRequestId } from "../../domain/help-request/help-request-id";
import { UserId } from "../../domain/user/user-id";

export interface HelpRequestFilters {
  subject?: string;
  level?: string;
  status?: HelpRequestStatus;
  query?: string;
}

export interface HelpRequestRepository {
  save(request: HelpRequest): Promise<void>;
  byId(id: HelpRequestId): Promise<HelpRequest | null>;
  all(filters?: HelpRequestFilters): Promise<HelpRequest[]>;
  byAuthor(authorId: UserId): Promise<HelpRequest[]>;
  byAssignedHelper(helperId: UserId): Promise<HelpRequest[]>;
  allReported(): Promise<HelpRequest[]>;
  delete(id: HelpRequestId): Promise<void>;
}
