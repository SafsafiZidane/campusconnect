import jwt from "jsonwebtoken";
import {
  TokenService,
  UserTokenPayload,
} from "../../application/ports/token-service.port";

export class JwtTokenService implements TokenService {
  private readonly secret: string;

  constructor(secret?: string) {
    this.secret = secret || process.env.JWT_SECRET || "default-campusconnect-jwt-secret";
  }

  sign(payload: UserTokenPayload): string {
    return jwt.sign(payload, this.secret, { expiresIn: "7d" });
  }

  verify(token: string): UserTokenPayload | null {
    try {
      const decoded = jwt.verify(token, this.secret);
      return decoded as UserTokenPayload;
    } catch {
      return null;
    }
  }
}
