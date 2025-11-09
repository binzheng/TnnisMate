import type { Role } from "~/server/core/domain/role";

export interface AuthPort {
  verifyCredentials(identifier: string, password: string): Promise<null | { id: string; role: Role; name?: string | null; email?: string | null }>;
  getUserById(id: string): Promise<null | { id: string; role: Role; name?: string | null; email?: string | null }>;
}

