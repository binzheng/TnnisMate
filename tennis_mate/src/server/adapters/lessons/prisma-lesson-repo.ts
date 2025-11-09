import type {
	CreateSlotInput,
	LessonRepository,
	LessonSlotDto,
	SearchSlotsQuery,
	UpdateSlotInput,
} from "~/server/core/usecases/lessons/ports";
import type { PrismaClient } from "~/server/generated-types";

export class PrismaLessonRepository implements LessonRepository {
	constructor(private db: PrismaClient) {}

	listSlots(): Promise<LessonSlotDto[]> {
		return this.db.lessonSlot.findMany({
			orderBy: { start: "asc" },
			select: {
				id: true,
				courtId: true,
				coachId: true,
				capacity: true,
				start: true,
				end: true,
				court: { select: { name: true } },
			},
		}) as unknown as Promise<LessonSlotDto[]>;
	}

	createSlot(input: CreateSlotInput): Promise<LessonSlotDto> {
		return this.db.lessonSlot.create({
			data: { ...input },
		}) as unknown as Promise<LessonSlotDto>;
	}

	updateSlot(input: UpdateSlotInput): Promise<LessonSlotDto> {
		const { id, ...data } = input;
		return this.db.lessonSlot.update({
			where: { id },
			data,
		}) as unknown as Promise<LessonSlotDto>;
	}

	async deleteSlot(id: string): Promise<void> {
		await this.db.lessonSlot.delete({ where: { id } });
	}

	countReservationsForSlot(id: string): Promise<number> {
		return this.db.lessonReservation.count({ where: { slotId: id } });
	}

	async searchCandidateSlots(q: SearchSlotsQuery): Promise<LessonSlotDto[]> {
		const where: any = {};
		if (q.courtId) where.courtId = q.courtId;
		if (q.coachId) where.coachId = q.coachId;
		if (q.start) where.start = { gte: q.start };
		if (q.end) where.end = { lte: q.end };
		const slots = await this.db.lessonSlot.findMany({
			where,
			orderBy: { start: "asc" },
			take: 50,
			select: {
				id: true,
				start: true,
				end: true,
				capacity: true,
				court: { select: { name: true } },
			},
		});
		return slots as unknown as LessonSlotDto[];
	}

	async bulkChangeReservations(
		reservationIds: string[],
		targetSlotId: string,
	): Promise<number> {
		const res = await this.db.lessonReservation.updateMany({
			where: { id: { in: reservationIds } },
			data: { slotId: targetSlotId },
		});
		return res.count;
	}
}

export class PrismaRoleRepository {
	constructor(private db: PrismaClient) {}
	async getRole(
		userId: string,
	): Promise<"player" | "coach" | "operator" | "admin" | undefined> {
		const me = await this.db.user.findUnique({
			where: { id: userId },
			select: { role: true },
		});
		return me?.role as any;
	}
}
