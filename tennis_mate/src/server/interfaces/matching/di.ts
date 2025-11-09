import type { PrismaClient } from "~/server/generated-types";
import { PrismaMatchingRepository } from "~/server/adapters/matching/prisma-matching-repo";
import { ActOnProposalUseCase, GetProposalUseCase, ListIncomingProposalsUseCase, ListOutgoingProposalsUseCase, SearchPlayersUseCase, SendProposalUseCase, UpsertProfileUseCase } from "~/server/core/usecases/matching/usecases";
import { LoggerAuditAdapter } from "~/server/adapters/common/logger-audit-adapter";

export function createMatchingUseCases(db: PrismaClient) {
  const repo = new PrismaMatchingRepository(db);
  const audit = new LoggerAuditAdapter();
  return {
    upsertProfile: new UpsertProfileUseCase(repo, audit),
    searchPlayers: new SearchPlayersUseCase(repo),
    sendProposal: new SendProposalUseCase(repo, audit),
    actOnProposal: new ActOnProposalUseCase(repo, audit),
    listIncoming: new ListIncomingProposalsUseCase(repo),
    listOutgoing: new ListOutgoingProposalsUseCase(repo),
    getProposal: new GetProposalUseCase(repo),
  } as const;
}
