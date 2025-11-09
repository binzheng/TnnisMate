import type {
	AddScoreInput,
	HistoryQuery,
	RankingRowDto,
	ScoreRecordDto,
	ScoreRepository,
} from "~/server/core/usecases/scores/ports";
import type { PrismaClient } from "~/server/generated-types";

export class PrismaScoreRepository implements ScoreRepository {
	constructor(private db: PrismaClient) {}

	async createScore(input: AddScoreInput): Promise<ScoreRecordDto> {
		const rec = await this.db.scoreRecord.create({
			data: {
				playerId: input.playerId,
				opponentId: input.opponentId,
				date: input.date,
				result: input.result,
			},
		});
		return rec as unknown as ScoreRecordDto;
	}

	async findHistory(q: HistoryQuery): Promise<ScoreRecordDto[]> {
		const where: any = { playerId: q.playerId };
		if (q.from) where.date = { gte: q.from };
		if (q.to) where.date = { ...(where.date ?? {}), lte: q.to };
		const rows = await this.db.scoreRecord.findMany({
			where,
			orderBy: { date: "desc" },
			take: 100,
		});
		return rows as unknown as ScoreRecordDto[];
	}

	async groupRankingTop(limit: number): Promise<RankingRowDto[]> {
		const rows = await this.db.scoreRecord.groupBy({
			by: ["playerId"],
			_count: { _all: true },
		});
		return rows
			.sort((a, b) => b._count._all - a._count._all)
			.slice(0, limit)
			.map((r) => ({ playerId: r.playerId, count: r._count._all }));
	}
}
