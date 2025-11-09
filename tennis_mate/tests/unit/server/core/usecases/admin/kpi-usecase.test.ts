import { describe, expect, it } from "vitest";
import type {
	AdminAnalyticsRepository,
	KpiQuery,
} from "@/server/core/usecases/admin/ports";
import { KpiUseCase } from "@/server/core/usecases/admin/usecases";

class Repo implements AdminAnalyticsRepository {
	async reservationsCount() {
		return 10;
	}
	async lessonReservationsTotal() {
		return 30;
	}
	async cancellationsCount() {
		return 2;
	}
	async lessonSlotsCapacitySum() {
		return 60;
	}
	async lessonAveragePrice() {
		return 2000;
	}
}

describe("KpiUseCase", () => {
	it("computes utilization and estimate", async () => {
		const uc = new KpiUseCase(new Repo());
		const r = await uc.execute({} satisfies KpiQuery);
		expect(r.utilizationPercent).toBe(50);
		expect(r.estimateYen).toBe(30 * 2000);
		expect(r.reservationsCount).toBe(10);
		expect(r.cancellationsCount).toBe(2);
	});
});
