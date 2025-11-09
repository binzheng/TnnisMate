import { db } from "~/server/db";
import type { AuthPort } from "~/server/core/usecases/auth/ports";
import type { Role } from "~/server/core/domain/role";

// NOTE: Placeholder implementation. Password verification requires bcrypt.
// This adapter only demonstrates structure; wire actual hashing in future work.
export class PrismaAuthAdapter implements AuthPort {
  async verifyCredentials(identifier: string, _password: string) {
    const user = await db.user.findFirst({
      where: { OR: [{ email: identifier }, { name: identifier }] },
      select: { id: true, name: true, email: true },
    });
    if (!user) return null;
    // TODO: verify password hash (bcrypt) once hashing is in place
    const role: Role = "player"; // default until role column is added
    return { id: user.id, role, name: user.name, email: user.email };
  }

  async getUserById(id: string) {
    const user = await db.user.findUnique({ select: { id: true, name: true, email: true }, where: { id } });
    if (!user) return null;
    const role: Role = "player";
    return { id: user.id, role, name: user.name, email: user.email };
  }
}

