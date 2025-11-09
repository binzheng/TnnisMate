import type { PrismaClient } from "~/server/generated-types";
import { PrismaScoreRepository } from "~/server/adapters/scores/prisma-score-repo";
import { AddScoreUseCase, MyHistoryUseCase, RankingSummaryUseCase } from "~/server/core/usecases/scores/usecases";

export function createScoreUseCases(db: PrismaClient) {
  const repo = new PrismaScoreRepository(db);
  return {
    addScore: new AddScoreUseCase(repo),
    myHistory: new MyHistoryUseCase(repo),
    rankingSummary: new RankingSummaryUseCase(repo),
  } as const;
}

