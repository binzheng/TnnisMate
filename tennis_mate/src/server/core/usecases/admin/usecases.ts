import type { AdminAnalyticsRepository, KpiQuery, KpiResult } from "./ports";

export class KpiUseCase {
	constructor(private repo: AdminAnalyticsRepository) {}
	async execute(q: KpiQuery = {}): Promise<KpiResult> {
		const [
			reservationsCount,
			lessonReservationsTotal,
			cancellationsCount,
			totalCapacity,
			avgPrice,
		] = await Promise.all([
			this.repo.reservationsCount(q),
			this.repo.lessonReservationsTotal(q),
			this.repo.cancellationsCount(q),
			this.repo.lessonSlotsCapacitySum(q),
			this.repo.lessonAveragePrice(),
		]);

		const utilizationPercent =
			totalCapacity > 0
				? Math.min(
						100,
						Math.round((lessonReservationsTotal / totalCapacity) * 100),
					)
				: 0;
		const estimateYen = lessonReservationsTotal * (avgPrice || 2000);
		return {
			reservationsCount,
			lessonReservationsTotal,
			cancellationsCount,
			utilizationPercent,
			estimateYen,
		};
	}
}
