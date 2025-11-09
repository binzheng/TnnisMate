import type { AuditPort } from "~/server/core/ports/audit";
import type { AuthzPort } from "~/server/core/ports/authz";
import type {
	CreateUserInput,
	UpdateUserInput,
	UserDto,
	UsersRepository,
} from "./ports";

export class ListUsersUseCase {
	constructor(
		private repo: UsersRepository,
		private authz: AuthzPort,
	) {}
	async execute(requestUserId: string): Promise<UserDto[]> {
		await this.authz.requireRole(requestUserId, ["operator", "admin"]);
		return this.repo.list();
	}
}

export class CreateUserUseCase {
	constructor(
		private repo: UsersRepository,
		private authz: AuthzPort,
		private audit?: AuditPort,
	) {}
	async execute(
		requestUserId: string,
		input: CreateUserInput & { passwordHash?: string },
	): Promise<UserDto> {
		await this.authz.requireRole(requestUserId, ["admin"]);
		const user = await this.repo.create(input);
		this.audit?.log({
			level: "info",
			msg: "user.create",
			userId: requestUserId,
			resource: `user:${user.id}`,
		});
		return user;
	}
}

export class UpdateUserUseCase {
	constructor(
		private repo: UsersRepository,
		private authz: AuthzPort,
		private audit?: AuditPort,
	) {}
	async execute(
		requestUserId: string,
		input: UpdateUserInput,
	): Promise<UserDto> {
		await this.authz.requireRole(requestUserId, ["admin"]);
		const user = await this.repo.update(input);
		this.audit?.log({
			level: "info",
			msg: "user.update",
			userId: requestUserId,
			resource: `user:${user.id}`,
		});
		return user;
	}
}

export class DeleteUserUseCase {
	constructor(
		private repo: UsersRepository,
		private authz: AuthzPort,
		private audit?: AuditPort,
	) {}
	async execute(requestUserId: string, id: string): Promise<void> {
		await this.authz.requireRole(requestUserId, ["admin"]);
		await this.repo.delete(id);
		this.audit?.log({
			level: "info",
			msg: "user.delete",
			userId: requestUserId,
			resource: `user:${id}`,
		});
	}
}

export class ResetPasswordUseCase {
	constructor(
		private repo: UsersRepository,
		private authz: AuthzPort,
		private audit?: AuditPort,
	) {}
	async execute(
		requestUserId: string,
		input: { id: string; passwordHash: string },
	): Promise<void> {
		await this.authz.requireRole(requestUserId, ["admin"]);
		await this.repo.setPassword(input.id, input.passwordHash);
		this.audit?.log({
			level: "info",
			msg: "user.password.reset",
			userId: requestUserId,
			resource: `user:${input.id}`,
		});
	}
}
