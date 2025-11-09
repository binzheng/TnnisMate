import { describe, expect, it } from "vitest";
import type { AuditPort } from "@/server/core/ports/audit";
import type { AuthzPort } from "@/server/core/ports/authz";
import type {
	CreateUserInput,
	UpdateUserInput,
	UserDto,
	UsersRepository,
} from "@/server/core/usecases/users/ports";
import {
	CreateUserUseCase,
	DeleteUserUseCase,
	ListUsersUseCase,
	ResetPasswordUseCase,
	UpdateUserUseCase,
} from "@/server/core/usecases/users/usecases";

class InMemoryUsersRepo implements UsersRepository {
	users: UserDto[] = [];
	pw: Record<string, string> = {};
	async list(): Promise<UserDto[]> {
		return this.users.slice();
	}
	async create(
		input: CreateUserInput & { passwordHash?: string | undefined },
	): Promise<UserDto> {
		const id = `u${this.users.length + 1}`;
		const row: UserDto = {
			id,
			email: input.email,
			name: input.name,
			role: (input.role ?? "player") as any,
		};
		this.users.push(row);
		if (input.passwordHash) this.pw[id] = input.passwordHash;
		return row;
	}
	async update(input: UpdateUserInput): Promise<UserDto> {
		const i = this.users.findIndex((u) => u.id === input.id);
		if (i < 0) throw new Error("not found");
		const u = (this.users[i] = { ...this.users[i], ...input } as any);
		return u;
	}
	async delete(id: string): Promise<void> {
		this.users = this.users.filter((u) => u.id !== id);
	}
	async setPassword(id: string, passwordHash: string): Promise<void> {
		this.pw[id] = passwordHash;
	}
}

class AuthzAllow implements AuthzPort {
	async getRole() {
		return "admin";
	}
	async requireRole() {
		/* ok */
	}
}
class AuthzOp implements AuthzPort {
	async getRole() {
		return "operator";
	}
	async requireRole(_uid: string, allowed: any[]) {
		if (!allowed.includes("operator") && !allowed.includes("admin"))
			throw new Error("forbidden");
	}
}
class AuthzDeny implements AuthzPort {
	async getRole() {
		return "player";
	}
	async requireRole() {
		throw new Error("forbidden");
	}
}
class CaptureAudit implements AuditPort {
	events: any[] = [];
	log(e: any) {
		this.events.push(e);
	}
}

describe("Users usecases", () => {
	it("list requires operator or admin", async () => {
		const repo = new InMemoryUsersRepo();
		repo.users = [{ id: "u1", email: "a@x", name: "A", role: "player" }];
		const ucOp = new ListUsersUseCase(repo, new AuthzOp());
		await expect(ucOp.execute("me")).resolves.toHaveLength(1);
		const ucDeny = new ListUsersUseCase(repo, new AuthzDeny() as any);
		await expect(ucDeny.execute("me")).rejects.toThrow();
	});

	it("admin can create/update/delete and reset password with audit", async () => {
		const repo = new InMemoryUsersRepo();
		const audit = new CaptureAudit();
		const create = new CreateUserUseCase(repo, new AuthzAllow(), audit);
		const update = new UpdateUserUseCase(repo, new AuthzAllow(), audit);
		const del = new DeleteUserUseCase(repo, new AuthzAllow(), audit);
		const reset = new ResetPasswordUseCase(repo, new AuthzAllow(), audit);

		const u = await create.execute("admin", {
			email: "b@example.com",
			name: "B",
			role: "coach",
			passwordHash: "hash",
		});
		expect(u.id).toBeDefined();
		expect(repo.pw[u.id]).toBe("hash");

		const u2 = await update.execute("admin", {
			id: u.id,
			name: "B2",
		} as UpdateUserInput);
		expect(u2.name).toBe("B2");

		await reset.execute("admin", { id: u.id, passwordHash: "new" });
		expect(repo.pw[u.id]).toBe("new");

		await del.execute("admin", u.id);
		expect(repo.users.find((x) => x.id === u.id)).toBeUndefined();

		// audit events should be recorded
		const keys = audit.events.map((e) => e.msg);
		expect(keys).toEqual(
			expect.arrayContaining([
				"user.create",
				"user.update",
				"user.password.reset",
				"user.delete",
			]),
		);
	});

	it("create user with default role", async () => {
		const repo = new InMemoryUsersRepo();
		const create = new CreateUserUseCase(repo, new AuthzAllow());
		const u = await create.execute("admin", {
			email: "test@example.com",
			name: "Test",
		});
		expect(u.role).toBe("player");
	});

	it("create user without password hash", async () => {
		const repo = new InMemoryUsersRepo();
		const create = new CreateUserUseCase(repo, new AuthzAllow());
		const u = await create.execute("admin", { email: "test@example.com" });
		expect(repo.pw[u.id]).toBeUndefined();
	});

	it("update user email", async () => {
		const repo = new InMemoryUsersRepo();
		const create = new CreateUserUseCase(repo, new AuthzAllow());
		const update = new UpdateUserUseCase(repo, new AuthzAllow());

		const u = await create.execute("admin", {
			email: "old@example.com",
			name: "User",
		});
		const updated = await update.execute("admin", {
			id: u.id,
			email: "new@example.com",
		});
		expect(updated.email).toBe("new@example.com");
	});

	it("update user role", async () => {
		const repo = new InMemoryUsersRepo();
		const create = new CreateUserUseCase(repo, new AuthzAllow());
		const update = new UpdateUserUseCase(repo, new AuthzAllow());

		const u = await create.execute("admin", {
			email: "test@example.com",
			role: "player",
		});
		const updated = await update.execute("admin", { id: u.id, role: "coach" });
		expect(updated.role).toBe("coach");
	});

	it("delete non-existent user does not fail", async () => {
		const repo = new InMemoryUsersRepo();
		const del = new DeleteUserUseCase(repo, new AuthzAllow());
		await expect(del.execute("admin", "non-existent")).resolves.toBeUndefined();
	});

	it("update non-existent user throws error", async () => {
		const repo = new InMemoryUsersRepo();
		const update = new UpdateUserUseCase(repo, new AuthzAllow());
		await expect(
			update.execute("admin", { id: "non-existent", name: "Test" }),
		).rejects.toThrow("not found");
	});

	it("list returns users in order", async () => {
		const repo = new InMemoryUsersRepo();
		repo.users = [
			{ id: "u1", email: "a@x", name: "A", role: "player" },
			{ id: "u2", email: "b@x", name: "B", role: "coach" },
			{ id: "u3", email: "c@x", name: "C", role: "admin" },
		];
		const uc = new ListUsersUseCase(repo, new AuthzAllow());
		const list = await uc.execute("admin");
		expect(list).toHaveLength(3);
		expect(list[0].email).toBe("a@x");
		expect(list[1].email).toBe("b@x");
		expect(list[2].email).toBe("c@x");
	});

	it("create user without audit does not fail", async () => {
		const repo = new InMemoryUsersRepo();
		const create = new CreateUserUseCase(repo, new AuthzAllow());
		const u = await create.execute("admin", { email: "test@example.com" });
		expect(u.id).toBeDefined();
	});

	it("password reset updates password hash", async () => {
		const repo = new InMemoryUsersRepo();
		const create = new CreateUserUseCase(repo, new AuthzAllow());
		const reset = new ResetPasswordUseCase(repo, new AuthzAllow());

		const u = await create.execute("admin", {
			email: "test@example.com",
			passwordHash: "old-hash",
		});
		expect(repo.pw[u.id]).toBe("old-hash");

		await reset.execute("admin", { id: u.id, passwordHash: "new-hash" });
		expect(repo.pw[u.id]).toBe("new-hash");
	});

	it("all roles can be created", async () => {
		const repo = new InMemoryUsersRepo();
		const create = new CreateUserUseCase(repo, new AuthzAllow());

		const player = await create.execute("admin", {
			email: "player@x",
			role: "player",
		});
		const coach = await create.execute("admin", {
			email: "coach@x",
			role: "coach",
		});
		const operator = await create.execute("admin", {
			email: "operator@x",
			role: "operator",
		});
		const admin = await create.execute("admin", {
			email: "admin@x",
			role: "admin",
		});

		expect(player.role).toBe("player");
		expect(coach.role).toBe("coach");
		expect(operator.role).toBe("operator");
		expect(admin.role).toBe("admin");
	});
});
