import type { PrismaClient } from "~/server/generated-types";
import type { ReservationRepository, ReservationSlot } from "~/server/core/usecases/reservations/ports";

export class PrismaReservationRepository implements ReservationRepository {
  constructor(private db: PrismaClient) {}
  create(data: { courtId: string; userId: string; start: Date; end: Date; }): Promise<ReservationSlot> {
    return this.db.reservation.create({ data }) as unknown as Promise<ReservationSlot>;
  }
  update(id: string, data: { start?: Date | undefined; end?: Date | undefined; }): Promise<ReservationSlot> {
    return this.db.reservation.update({ where: { id }, data }) as unknown as Promise<ReservationSlot>;
  }
  cancel(id: string): Promise<ReservationSlot> {
    return this.db.reservation.delete({ where: { id } }) as unknown as Promise<ReservationSlot>;
  }
}

