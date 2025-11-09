import { audit as consoleAudit } from "~/lib/logger";
import type { AuditEvent, AuditPort } from "~/server/core/ports/audit";

export class LoggerAuditAdapter implements AuditPort {
	log(event: AuditEvent): void {
		consoleAudit(event);
	}
}
