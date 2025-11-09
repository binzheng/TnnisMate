export type Role = "player" | "coach" | "operator" | "admin" | undefined;

export interface AuthzPort {
	getRole(userId: string): Promise<Role>;
	requireRole(
		userId: string,
		allowed: Array<Exclude<Role, undefined>>,
	): Promise<void>;
}
