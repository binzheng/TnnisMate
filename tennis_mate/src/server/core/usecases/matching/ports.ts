export interface ProfileUpsertInput { userId: string; level: number; area?: string; available?: unknown }
export interface PlayerProfileDto { userId: string; level: number; area?: string | null }
export interface SearchPlayersQuery { levelMin?: number; levelMax?: number; area?: string }

export interface ProposalSendInput { fromUser: string; toUser: string; start: Date; end: Date; message?: string }
export type ProposalId = string;
export type ProposalStatus = 'pending' | 'accepted' | 'declined';
export interface MatchProposalDto { id: string; fromUser: string; toUser: string; start: Date; end: Date; status: ProposalStatus; message?: string | null }

export interface MatchingRepository {
  upsertProfile(input: ProfileUpsertInput): Promise<PlayerProfileDto>;
  searchPlayers(q: SearchPlayersQuery): Promise<PlayerProfileDto[]>;
  createProposal(input: ProposalSendInput): Promise<MatchProposalDto>;
  updateProposalStatus(id: ProposalId, status: ProposalStatus): Promise<MatchProposalDto>;
  findProposal(id: ProposalId): Promise<MatchProposalDto | null>;
  listIncoming(userId: string): Promise<MatchProposalDto[]>;
  listOutgoing(userId: string): Promise<MatchProposalDto[]>;
}

