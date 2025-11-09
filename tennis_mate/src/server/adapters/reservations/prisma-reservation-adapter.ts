import type { ConflictDetectionPort, ReservationSlot } from "~/server/core/usecases/reservations/ports";
import type { PrismaClient } from "~/server/generated-types";

export class PrismaReservationReader implements ConflictDetectionPort {
  constructor(private readonly prisma: PrismaClient) {}

  async getReservationsInRange(input: {
    start: Date;
    end: Date;
    courtId?: string;
    userId?: string;
  }): Promise<ReservationSlot[]> {
    const where: any = {
      // overlap predicate: [start,end) ∧ [R.start,R.end)
      start: { lt: input.end },
      end: { gt: input.start },
    };
    if (input.courtId) where.courtId = input.courtId;
    if (input.userId) where.userId = input.userId;

    const rows = await this.prisma.reservation.findMany({
      where,
      select: { id: true, courtId: true, userId: true, start: true, end: true },
      orderBy: { start: "asc" },
      take: 200, // sane cap
    });

    return rows.map((r) => ({ ...r }));
  }
}
