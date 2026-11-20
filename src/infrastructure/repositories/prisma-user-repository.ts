import { prisma } from "../db/prisma";
import { UserRepository } from "../../application/ports/user-repository.port";
import { User } from "../../domain/user/user";
import { UserId } from "../../domain/user/user-id";
import { UserMapper } from "../mappers/user.mapper";

export class PrismaUserRepository implements UserRepository {
  async save(user: User): Promise<void> {
    const data = UserMapper.toPersistence(user);
    await prisma.user.upsert({
      where: { id: data.id },
      create: data,
      update: data,
    });
  }

  async byId(id: UserId): Promise<User | null> {
    const row = await prisma.user.findUnique({
      where: { id: id.value },
    });
    return row ? UserMapper.toDomain(row) : null;
  }

  async byEmail(email: string): Promise<User | null> {
    const row = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });
    return row ? UserMapper.toDomain(row) : null;
  }

  async all(): Promise<User[]> {
    const rows = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
    return rows.map(UserMapper.toDomain);
  }

  async delete(id: UserId): Promise<void> {
    await prisma.user.delete({
      where: { id: id.value },
    });
  }
}
