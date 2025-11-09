import type { PrismaClient } from "~/server/generated-types";
import type { AuthzPort, Role } from "~/server/core/ports/authz";
import { TRPCError } from "@trpc/server";

export class PrismaAuthzAdapter implements AuthzPort {
  constructor(private db: PrismaClient) {}
  async getRole(userId: string): Promise<Role> {
    const me = await this.db.user.findUnique({ where: { id: userId }, select: { role: true } });
    return me?.role as Role;
  }
  async requireRole(userId: string, allowed: Array<Exclude<Role, undefined>>): Promise<void> {
    const role = await this.getRole(userId);
    if (!role || !allowed.includes(role as any)) throw new TRPCError({ code: "FORBIDDEN" });
  }
}

