import type { AuditPort } from "~/server/core/ports/audit";
import type {
	ImportJobDto,
	InventoryRepository,
	StartCsvImportInput,
} from "./ports";

export class StartCsvImportUseCase {
	constructor(
		private repo: InventoryRepository,
		private audit?: AuditPort,
	) {}
	async execute(
		input: StartCsvImportInput & { userId?: string; requestId?: string },
	): Promise<ImportJobDto> {
		const job = await this.repo.createJob("csv", input.source ?? "manual");
		// NOTE: Real processing deferred. Record only counts for now.
		const finished = await this.repo.finishJob(job.id, {
			status: "success",
			finishedAt: new Date(),
			added: input.rows.length,
		});
		this.audit?.log({
			level: "info",
			msg: "inventory.csv.import",
			userId: input.userId,
			requestId: input.requestId,
			resource: `importJob:${finished.id}`,
			meta: { added: finished.added ?? input.rows.length },
		});
		return finished;
	}
}

export class ListJobsUseCase {
	constructor(private repo: InventoryRepository) {}
	execute(limit = 50) {
		return this.repo.listJobs(limit);
	}
}
