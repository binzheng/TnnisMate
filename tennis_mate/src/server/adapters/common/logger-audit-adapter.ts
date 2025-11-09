import type { AuditEvent, AuditPort } from "~/server/core/ports/audit";
import { audit as consoleAudit } from "~/lib/logger";

export class LoggerAuditAdapter implements AuditPort {
  log(event: AuditEvent): void {
    consoleAudit(event);
  }
}

