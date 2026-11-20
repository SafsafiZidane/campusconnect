export interface UserTokenPayload {
  userId: string;
  email: string;
  name: string;
  role: "STUDENT" | "ADMIN";
}

export interface TokenService {
  sign(payload: UserTokenPayload): string;
  verify(token: string): UserTokenPayload | null;
}
