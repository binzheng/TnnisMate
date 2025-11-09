import { LoggerAuditAdapter } from "~/server/adapters/common/logger-audit-adapter";
import { PrismaReservationRepository } from "~/server/adapters/reservations/prisma-reservation-repo";
import {
	CancelReservationUseCase,
	CreateReservationUseCase,
	UpdateReservationUseCase,
} from "~/server/core/usecases/reservations/crud-usecases";
import type { PrismaClient } from "~/server/generated-types";

export function createReservationUseCases(db: PrismaClient) {
	const repo = new PrismaReservationRepository(db);
	const audit = new LoggerAuditAdapter();
	return {
		create: new CreateReservationUseCase(repo, audit),
		update: new UpdateReservationUseCase(repo, audit),
		cancel: new CancelReservationUseCase(repo, audit),
	} as const;
}
