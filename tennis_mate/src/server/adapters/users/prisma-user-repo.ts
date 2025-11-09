import type { PrismaClient } from "~/server/generated-types";
import type { CreateUserInput, UpdateUserInput, UserDto, UsersRepository } from "~/server/core/usecases/users/ports";

export class PrismaUsersRepository implements UsersRepository {
  constructor(private db: PrismaClient) {}
  async list(): Promise<UserDto[]> {
    const rows = await this.db.user.findMany({ orderBy: { email: 'asc' }, select: { id: true, name: true, email: true, role: true } });
    return rows as unknown as UserDto[];
  }
  async create(input: CreateUserInput & { passwordHash?: string }): Promise<UserDto> {
    const row = await this.db.user.create({ data: { email: input.email, name: input.name, role: (input.role ?? 'player') as any, passwordHash: input.passwordHash } });
    return { id: row.id, name: row.name, email: row.email, role: row.role as any };
  }
  async update(input: UpdateUserInput): Promise<UserDto> {
    const { id, ...data } = input as any;
    const row = await this.db.user.update({ where: { id }, data });
    return { id: row.id, name: row.name, email: row.email, role: row.role as any };
  }
  async delete(id: string): Promise<void> {
    await this.db.user.delete({ where: { id } });
  }
  async setPassword(id: string, passwordHash: string): Promise<void> {
    await this.db.user.update({ where: { id }, data: { passwordHash } });
  }
}

