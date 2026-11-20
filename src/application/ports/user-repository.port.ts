import { User } from "../../domain/user/user";
import { UserId } from "../../domain/user/user-id";

export interface UserRepository {
  save(user: User): Promise<void>;
  byId(id: UserId): Promise<User | null>;
  byEmail(email: string): Promise<User | null>;
  all(): Promise<User[]>;
  delete(id: UserId): Promise<void>;
}
