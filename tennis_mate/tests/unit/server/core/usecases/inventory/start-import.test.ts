import { describe, expect, it } from "vitest";
import type { AuditPort } from "@/server/core/ports/audit";
import type {
	ImportJobDto,
	InventoryRepository,
} from "@/server/core/usecases/inventory/ports";
import { StartCsvImportUseCase } from "@/server/core/usecases/inventory/usecases";

class Repo implements InventoryRepository {
	job?: ImportJobDto;
	async createJob() {
		return {
			id: "j1",
			type: "csv",
			status: "running",
			createdAt: new Date(0),
		} as any;
	}
	async finishJob() {
		return {
			id: "j1",
			type: "csv",
			status: "success",
			createdAt: new Date(0),
			finishedAt: new Date(1),
			added: 3,
		} as any;
	}
	async listJobs() {
		return [];
	}
}
class CaptureAudit implements AuditPort {
	events: any[] = [];
	log(e: any) {
		this.events.push(e);
	}
}

describe("StartCsvImportUseCase", () => {
	it("records job and logs audit", async () => {
		const repo = new Repo();
		const audit = new CaptureAudit();
		const uc = new StartCsvImportUseCase(repo as any, audit);
		const res = await uc.execute({
			source: "test",
			rows: [{ a: "1" }, { a: "2" }, { a: "3" }],
			userId: "u1",
			requestId: "req1",
		});
		expect(res.status).toBe("success");
		expect(res.added ?? 0).toBe(3);
		expect(
			audit.events.some(
				(e) => e.msg === "inventory.csv.import" && e.userId === "u1",
			),
		).toBe(true);
	});
});
