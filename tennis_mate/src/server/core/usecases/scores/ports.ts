export interface AddScoreInput {
  playerId: string;
  opponentId: string;
  date: Date;
  result: string;
}

export interface HistoryQuery {
  playerId: string;
  from?: Date;
  to?: Date;
}

export type ScoreRecordDto = {
  id: string;
  playerId: string;
  opponentId: string;
  date: Date;
  result: string;
};

export interface RankingRowDto {
  playerId: string;
  count: number;
}

export interface ScoreRepository {
  createScore(input: AddScoreInput): Promise<ScoreRecordDto>;
  findHistory(q: HistoryQuery): Promise<ScoreRecordDto[]>;
  groupRankingTop(limit: number): Promise<RankingRowDto[]>;
}

