import type { ConflictDetectionPort, Conflict, ReservationSlot } from "./ports";

export type DetectConflictsInput = {
  start: Date;
  end: Date;
  courtId?: string;
  userId?: string;
};

export class DetectConflictsUseCase {
  constructor(private readonly port: ConflictDetectionPort) {}

  async execute(input: DetectConflictsInput): Promise<Conflict[]> {
    if (input.end <= input.start) return [];
    const existing = await this.port.getReservationsInRange(input);
    const conflicts: Conflict[] = [];

    for (const r of existing) {
      if (!overlapsHalfOpen(input.start, input.end, r.start, r.end)) continue;
      if (input.courtId && r.courtId === input.courtId) {
        conflicts.push({
          targetReservationId: r.id,
          reason: "court-overlap",
          start: r.start,
          end: r.end,
        });
      }
      if (input.userId && r.userId === input.userId) {
        conflicts.push({
          targetReservationId: r.id,
          reason: "user-overlap",
          start: r.start,
          end: r.end,
        });
      }
    }

    return conflicts;
  }
}

export function overlapsHalfOpen(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
  // [aStart, aEnd) overlaps [bStart, bEnd) iff aStart < bEnd AND aEnd > bStart
  return aStart < bEnd && aEnd > bStart;
}

export class InMemoryReservationReader implements ConflictDetectionPort {
  constructor(private readonly data: ReservationSlot[]) {}
  async getReservationsInRange(input: {
    start: Date;
    end: Date;
    courtId?: string | undefined;
    userId?: string | undefined;
  }): Promise<ReservationSlot[]> {
    return this.data.filter((r) =>
      overlapsHalfOpen(input.start, input.end, r.start, r.end),
    );
  }
}

