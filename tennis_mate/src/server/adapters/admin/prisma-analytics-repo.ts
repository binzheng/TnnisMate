import type { PrismaClient } from "~/server/generated-types";
import type { AdminAnalyticsRepository, KpiQuery } from "~/server/core/usecases/admin/ports";

export class PrismaAdminAnalyticsRepository implements AdminAnalyticsRepository {
  constructor(private db: PrismaClient) {}

  private rangeFilter(q: KpiQuery, fields: string[]) {
    const clauses = [] as any[];
    for (const f of fields) {
      const cond: any = {};
      if (q.from) cond[f] = { ...(cond[f] ?? {}), gte: q.from };
      if (q.to) cond[f] = { ...(cond[f] ?? {}), lte: q.to };
      if (Object.keys(cond).length) clauses.push(cond);
    }
    return clauses.length ? { AND: clauses } : undefined;
  }

  reservationsCount(q: KpiQuery): Promise<number> {
    return this.db.reservation.count({ where: this.rangeFilter(q, ['start', 'end']) });
  }
  lessonReservationsTotal(q: KpiQuery): Promise<number> {
    return this.db.lessonReservation.count({ where: this.rangeFilter(q, ['createdAt']) });
  }
  cancellationsCount(q: KpiQuery): Promise<number> {
    return this.db.lessonReservation.count({ where: { status: 'cancelled', ...(this.rangeFilter(q, ['createdAt']) ?? {}) } });
  }
  async lessonSlotsCapacitySum(q: KpiQuery): Promise<number> {
    const agg = await this.db.lessonSlot.aggregate({ _sum: { capacity: true }, where: this.rangeFilter(q, ['start', 'end']) });
    return agg._sum.capacity ?? 0;
  }
  async lessonAveragePrice(): Promise<number> {
    const agg = await this.db.lessonPolicy.aggregate({ _avg: { priceYen: true } });
    return agg._avg.priceYen ?? 2000;
  }
}

