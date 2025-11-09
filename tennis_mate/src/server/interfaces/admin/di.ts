import type { PrismaClient } from "~/server/generated-types";
import { PrismaAdminAnalyticsRepository } from "~/server/adapters/admin/prisma-analytics-repo";
import { KpiUseCase } from "~/server/core/usecases/admin/usecases";

export function createAdminUseCases(db: PrismaClient) {
  const repo = new PrismaAdminAnalyticsRepository(db);
  return {
    kpis: new KpiUseCase(repo),
  } as const;
}

