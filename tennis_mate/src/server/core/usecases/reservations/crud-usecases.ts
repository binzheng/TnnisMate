import type { AuditPort } from "~/server/core/ports/audit";
import type { ReservationRepository, ReservationSlot } from "./ports";

export class CreateReservationUseCase {
	constructor(
		private repo: ReservationRepository,
		private audit?: AuditPort,
	) {}
	async execute(input: {
		courtId: string;
		userId: string;
		start: Date;
		end: Date;
		requestId?: string;
	}): Promise<ReservationSlot> {
		// Pass only fields that exist on Reservation to the repository/Prisma
		const created = await this.repo.create({
			courtId: input.courtId,
			userId: input.userId,
			start: input.start,
			end: input.end,
		});
		this.audit?.log({
			level: "info",
			msg: "reservation.create",
			userId: input.userId,
			resource: `reservation:${created.id}`,
			requestId: input.requestId,
			meta: {
				courtId: created.courtId,
				start: created.start,
				end: created.end,
			},
		});
		return created;
	}
}

export class UpdateReservationUseCase {
	constructor(
		private repo: ReservationRepository,
		private audit?: AuditPort,
	) {}
	async execute(input: {
		id: string;
		start?: Date;
		end?: Date;
		userId?: string;
		requestId?: string;
	}): Promise<ReservationSlot> {
		const updated = await this.repo.update(input.id, {
			start: input.start,
			end: input.end,
		});
		this.audit?.log({
			level: "info",
			msg: "reservation.update",
			userId: input.userId,
			resource: `reservation:${updated.id}`,
			requestId: input.requestId,
			meta: { start: updated.start, end: updated.end },
		});
		return updated;
	}
}

export class CancelReservationUseCase {
	constructor(
		private repo: ReservationRepository,
		private audit?: AuditPort,
	) {}
	async execute(input: {
		id: string;
		userId?: string;
		requestId?: string;
	}): Promise<ReservationSlot> {
		const deleted = await this.repo.cancel(input.id);
		this.audit?.log({
			level: "info",
			msg: "reservation.cancel",
			userId: input.userId,
			resource: `reservation:${deleted.id}`,
			requestId: input.requestId,
			meta: {
				courtId: deleted.courtId,
				start: deleted.start,
				end: deleted.end,
			},
		});
		return deleted;
	}
}
