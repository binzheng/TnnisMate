import { describe, expect, it } from "vitest";
import {
	DetectConflictsUseCase,
	InMemoryReservationReader,
	overlapsHalfOpen,
} from "@/server/core/usecases/reservations/detect-conflicts";
import type { ReservationSlot } from "@/server/core/usecases/reservations/ports";

const base = (overrides: Partial<ReservationSlot> = {}): ReservationSlot => ({
	id: overrides.id ?? "r1",
	courtId: overrides.courtId ?? "c1",
	userId: overrides.userId ?? "u1",
	start: overrides.start ?? new Date("2025-01-01T09:00:00Z"),
	end: overrides.end ?? new Date("2025-01-01T10:00:00Z"),
});

describe("overlapsHalfOpen", () => {
	it("returns true when half-open ranges overlap", () => {
		expect(
			overlapsHalfOpen(new Date(0), new Date(10), new Date(5), new Date(15)),
		).toBe(true);
	});
	it("returns false when touching at boundary", () => {
		expect(
			overlapsHalfOpen(new Date(0), new Date(10), new Date(10), new Date(15)),
		).toBe(false);
	});
});

describe("DetectConflictsUseCase", () => {
	it("detects court and user overlaps with half-open logic", async () => {
		const data: ReservationSlot[] = [
			base({ id: "r1" }),
			base({
				id: "r2",
				start: new Date("2025-01-01T10:00:00Z"),
				end: new Date("2025-01-01T11:00:00Z"),
			}),
		];
		const uc = new DetectConflictsUseCase(new InMemoryReservationReader(data));

		const res = await uc.execute({
			start: new Date("2025-01-01T09:30:00Z"),
			end: new Date("2025-01-01T10:30:00Z"),
			courtId: "c1",
			userId: "u1",
		});

		// Should find conflicts for r1 and r2, for both reasons
		const ids = res.map((c) => c.targetReservationId);
		expect(new Set(ids)).toEqual(new Set(["r1", "r2"]));
		expect(res.some((c) => c.reason === "court-overlap")).toBe(true);
		expect(res.some((c) => c.reason === "user-overlap")).toBe(true);
	});
});
