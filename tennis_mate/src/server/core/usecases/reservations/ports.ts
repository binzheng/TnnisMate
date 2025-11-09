export type ReservationSlot = {
	id: string;
	courtId: string;
	userId: string;
	start: Date;
	end: Date;
};

export interface ConflictDetectionPort {
	getReservationsInRange(input: {
		start: Date;
		end: Date;
		courtId?: string;
		userId?: string;
	}): Promise<ReservationSlot[]>;
}

export interface ReservationRepository {
	create(data: {
		courtId: string;
		userId: string;
		start: Date;
		end: Date;
	}): Promise<ReservationSlot>;
	update(
		id: string,
		data: { start?: Date; end?: Date },
	): Promise<ReservationSlot>;
	cancel(id: string): Promise<ReservationSlot>;
}

export type Conflict = {
	targetReservationId: string;
	reason: "court-overlap" | "user-overlap";
	start: Date;
	end: Date;
};
