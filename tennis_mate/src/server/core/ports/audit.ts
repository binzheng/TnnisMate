export type AuditLevel = "info" | "warn" | "error";

export interface AuditEvent {
	level: AuditLevel;
	msg: string;
	userId?: string;
	role?: string;
	resource?: string;
	requestId?: string;
	meta?: Record<string, unknown>;
}

export interface AuditPort {
	log(event: AuditEvent): Promise<void> | void;
}
