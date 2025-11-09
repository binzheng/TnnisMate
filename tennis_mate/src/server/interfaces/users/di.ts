import { LoggerAuditAdapter } from "~/server/adapters/common/logger-audit-adapter";
import { PrismaAuthzAdapter } from "~/server/adapters/common/prisma-authz-adapter";
import { PrismaUsersRepository } from "~/server/adapters/users/prisma-user-repo";
import {
	CreateUserUseCase,
	DeleteUserUseCase,
	ListUsersUseCase,
	ResetPasswordUseCase,
	UpdateUserUseCase,
} from "~/server/core/usecases/users/usecases";
import type { PrismaClient } from "~/server/generated-types";

export function createUsersUseCases(db: PrismaClient) {
	const repo = new PrismaUsersRepository(db);
	const audit = new LoggerAuditAdapter();
	const authz = new PrismaAuthzAdapter(db);
	return {
		list: new ListUsersUseCase(repo, authz),
		create: new CreateUserUseCase(repo, authz, audit),
		update: new UpdateUserUseCase(repo, authz, audit),
		remove: new DeleteUserUseCase(repo, authz, audit),
		resetPassword: new ResetPasswordUseCase(repo, authz, audit),
	} as const;
}
