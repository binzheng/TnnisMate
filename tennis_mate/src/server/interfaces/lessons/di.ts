import { LoggerAuditAdapter } from "~/server/adapters/common/logger-audit-adapter";
import { PrismaAuthzAdapter } from "~/server/adapters/common/prisma-authz-adapter";
import { PrismaLessonRepository } from "~/server/adapters/lessons/prisma-lesson-repo";
import {
	BulkChangeReservationsUseCase,
	CreateSlotUseCase,
	DeleteSlotUseCase,
	ListSlotsUseCase,
	SearchCandidateSlotsUseCase,
	UpdateSlotUseCase,
} from "~/server/core/usecases/lessons/usecases";
import type { PrismaClient } from "~/server/generated-types";

export function createLessonUseCases(db: PrismaClient) {
	const repo = new PrismaLessonRepository(db);
	const authz = new PrismaAuthzAdapter(db);
	const audit = new LoggerAuditAdapter();
	return {
		listSlots: new ListSlotsUseCase(repo, audit),
		createSlot: new CreateSlotUseCase(repo, authz, audit),
		updateSlot: new UpdateSlotUseCase(repo, authz, audit),
		deleteSlot: new DeleteSlotUseCase(repo, authz, audit),
		searchCandidateSlots: new SearchCandidateSlotsUseCase(repo),
		bulkChangeReservations: new BulkChangeReservationsUseCase(
			repo,
			authz,
			audit,
		),
	} as const;
}
