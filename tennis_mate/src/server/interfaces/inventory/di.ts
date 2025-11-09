import type { PrismaClient } from "~/server/generated-types";
import { PrismaInventoryRepository } from "~/server/adapters/inventory/prisma-inventory-repo";
import { ListJobsUseCase, StartCsvImportUseCase } from "~/server/core/usecases/inventory/usecases";
import { LoggerAuditAdapter } from "~/server/adapters/common/logger-audit-adapter";

export function createInventoryUseCases(db: PrismaClient) {
  const repo = new PrismaInventoryRepository(db);
  const audit = new LoggerAuditAdapter();
  return {
    startCsvImport: new StartCsvImportUseCase(repo, audit),
    listJobs: new ListJobsUseCase(repo),
  } as const;
}
