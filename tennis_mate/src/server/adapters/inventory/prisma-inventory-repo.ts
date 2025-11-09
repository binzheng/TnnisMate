import type { PrismaClient } from "~/server/generated-types";
import type { ImportJobDto, InventoryRepository } from "~/server/core/usecases/inventory/ports";

export class PrismaInventoryRepository implements InventoryRepository {
  constructor(private db: PrismaClient) {}
  async createJob(type: 'csv', source: string): Promise<ImportJobDto> {
    const job = await this.db.importJob.create({ data: { type, source, status: 'running' } });
    return job as unknown as ImportJobDto;
  }
  async finishJob(id: string, data: { status: 'success' | 'failed'; finishedAt: Date; added?: number | undefined; }): Promise<ImportJobDto> {
    const job = await this.db.importJob.update({ where: { id }, data });
    return job as unknown as ImportJobDto;
  }
  async listJobs(limit: number): Promise<ImportJobDto[]> {
    const rows = await this.db.importJob.findMany({ orderBy: { createdAt: 'desc' }, take: limit });
    return rows as unknown as ImportJobDto[];
  }
}

