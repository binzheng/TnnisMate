export interface KpiQuery { from?: Date; to?: Date }
export interface KpiResult { reservationsCount: number; lessonReservationsTotal: number; cancellationsCount: number; utilizationPercent: number; estimateYen: number }

export interface AdminAnalyticsRepository {
  reservationsCount(q: KpiQuery): Promise<number>;
  lessonReservationsTotal(q: KpiQuery): Promise<number>;
  cancellationsCount(q: KpiQuery): Promise<number>;
  lessonSlotsCapacitySum(q: KpiQuery): Promise<number>;
  lessonAveragePrice(): Promise<number>;
}

