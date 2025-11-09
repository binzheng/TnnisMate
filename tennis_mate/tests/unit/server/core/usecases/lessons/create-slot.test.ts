import { describe, expect, it } from "vitest";
import type { AuditPort } from "@/server/core/ports/audit";
import type { AuthzPort } from "@/server/core/ports/authz";
import type {
	LessonRepository,
	LessonSlotDto,
} from "@/server/core/usecases/lessons/ports";
import { CreateSlotUseCase } from "@/server/core/usecases/lessons/usecases";

class InMemoryLessonRepo implements LessonRepository {
	slots: LessonSlotDto[] = [];
	async listSlots() {
		return this.slots;
	}
	async createSlot(input: any) {
		const s = { id: "s1", ...input } as LessonSlotDto;
		this.slots.push(s);
		return s;
	}
	async updateSlot(input: any) {
		const s = (this.slots[0] = {
			...(this.slots[0] ?? { id: input.id }),
			...(input as any),
		});
		return s as LessonSlotDto;
	}
	async deleteSlot() {
		this.slots = [];
	}
	async countReservationsForSlot() {
		return 0;
	}
	async searchCandidateSlots() {
		return this.slots;
	}
	async bulkChangeReservations() {
		return 0;
	}
}

class AllowAuthz implements AuthzPort {
	async getRole() {
		return "admin";
	}
	async requireRole() {
		/* ok */
	}
}
class DenyAuthz implements AuthzPort {
	async getRole() {
		return "player";
	}
	async requireRole() {
		throw new Error("FORBIDDEN");
	}
}

class CaptureAudit implements AuditPort {
	events: any[] = [];
	log(e: any) {
		this.events.push(e);
	}
}

describe("CreateSlotUseCase (Authz + Audit)", () => {
	it("allows authorized roles and emits audit", async () => {
		const repo = new InMemoryLessonRepo();
		const audit = new CaptureAudit();
		const uc = new CreateSlotUseCase(repo as any, new AllowAuthz(), audit);
		const s = await uc.execute("u1", {
			courtId: "c1",
			capacity: 2,
			start: new Date(0),
			end: new Date(1),
		});
		expect(s.id).toBeDefined();
		expect(audit.events.some((e) => e.msg === "lesson.slot.create")).toBe(true);
	});

	it("rejects unauthorized roles", async () => {
		const repo = new InMemoryLessonRepo();
		const uc = new CreateSlotUseCase(repo as any, new DenyAuthz());
		await expect(
			uc.execute("u1", {
				courtId: "c1",
				capacity: 1,
				start: new Date(0),
				end: new Date(1),
			}),
		).rejects.toThrow();
	});
});
