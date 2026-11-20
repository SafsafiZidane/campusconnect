import bcrypt from "bcryptjs";
import { PasswordHasher } from "../../application/ports/password-hasher.port";

export class BcryptPasswordHasher implements PasswordHasher {
  async hash(plainText: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(plainText, salt);
  }

  async compare(plainText: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plainText, hashed);
  }
}
