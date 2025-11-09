export type AuditLog = {
	level: "info" | "warn" | "error";
	msg: string;
	userId?: string;
	role?: string;
	resource?: string;
	requestId?: string;
	// space for additional structured fields (safe, non-PII)
	meta?: Record<string, unknown>;
};

export function audit(log: AuditLog) {
	// Do not include PII; log as single-line JSON for easy ingestion
	// eslint-disable-next-line no-console
	console.log(JSON.stringify({ ts: new Date().toISOString(), ...log }));
}
