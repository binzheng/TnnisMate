import type {
	AddScoreInput,
	HistoryQuery,
	RankingRowDto,
	ScoreRecordDto,
	ScoreRepository,
} from "./ports";

export class AddScoreUseCase {
	constructor(private repo: ScoreRepository) {}
	async execute(input: AddScoreInput): Promise<ScoreRecordDto> {
		return this.repo.createScore(input);
	}
}

export class MyHistoryUseCase {
	constructor(private repo: ScoreRepository) {}
	async execute(q: HistoryQuery): Promise<ScoreRecordDto[]> {
		return this.repo.findHistory(q);
	}
}

export class RankingSummaryUseCase {
	constructor(private repo: ScoreRepository) {}
	async execute(limit = 20): Promise<RankingRowDto[]> {
		return this.repo.groupRankingTop(limit);
	}
}
