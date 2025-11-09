import type {
	MatchingRepository,
	MatchProposalDto,
	PlayerProfileDto,
	ProfileUpsertInput,
	ProposalId,
	ProposalStatus,
	SearchPlayersQuery,
} from "~/server/core/usecases/matching/ports";
import type { PrismaClient } from "~/server/generated-types";

export class PrismaMatchingRepository implements MatchingRepository {
	constructor(private db: PrismaClient) {}

	async upsertProfile(input: ProfileUpsertInput): Promise<PlayerProfileDto> {
		const profile = await this.db.playerProfile.upsert({
			where: { userId: input.userId },
			create: {
				userId: input.userId,
				level: input.level,
				area: input.area,
				available: input.available ?? undefined,
			},
			update: {
				level: input.level,
				area: input.area,
				available: input.available ?? undefined,
			},
		});
		return { userId: profile.userId, level: profile.level, area: profile.area };
	}

	async searchPlayers(q: SearchPlayersQuery): Promise<PlayerProfileDto[]> {
		const where: any = {};
		if (q.area) where.area = q.area;
		if (q.levelMin || q.levelMax)
			where.level = { gte: q.levelMin ?? 1, lte: q.levelMax ?? 10 };
		const rows = await this.db.playerProfile.findMany({
			where,
			select: { userId: true, level: true, area: true },
		});
		return rows;
	}

	createProposal(input: {
		fromUser: string;
		toUser: string;
		start: Date;
		end: Date;
		message?: string | undefined;
	}): Promise<MatchProposalDto> {
		return this.db.matchProposal.create({
			data: {
				fromUser: input.fromUser,
				toUser: input.toUser,
				start: input.start,
				end: input.end,
				message: input.message,
			},
		}) as unknown as Promise<MatchProposalDto>;
	}

	updateProposalStatus(
		id: ProposalId,
		status: ProposalStatus,
	): Promise<MatchProposalDto> {
		return this.db.matchProposal.update({
			where: { id },
			data: { status },
		}) as unknown as Promise<MatchProposalDto>;
	}

	findProposal(id: ProposalId): Promise<MatchProposalDto | null> {
		return this.db.matchProposal.findUnique({
			where: { id },
		}) as unknown as Promise<MatchProposalDto | null>;
	}

	listIncoming(userId: string): Promise<MatchProposalDto[]> {
		return this.db.matchProposal.findMany({
			where: { toUser: userId, status: "pending" },
			orderBy: { createdAt: "desc" },
			take: 100,
		}) as unknown as Promise<MatchProposalDto[]>;
	}
	listOutgoing(userId: string): Promise<MatchProposalDto[]> {
		return this.db.matchProposal.findMany({
			where: { fromUser: userId },
			orderBy: { createdAt: "desc" },
			take: 100,
		}) as unknown as Promise<MatchProposalDto[]>;
	}
}
