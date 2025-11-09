import { TRPCError } from "@trpc/server";
import type { AuditPort } from "~/server/core/ports/audit";
import type {
	MatchingRepository,
	MatchProposalDto,
	PlayerProfileDto,
	ProfileUpsertInput,
	ProposalId,
	SearchPlayersQuery,
} from "./ports";

export class UpsertProfileUseCase {
	constructor(
		private repo: MatchingRepository,
		private audit?: AuditPort,
	) {}
	async execute(input: ProfileUpsertInput): Promise<PlayerProfileDto> {
		const profile = await this.repo.upsertProfile(input);
		this.audit?.log({
			level: "info",
			msg: "matching.profile.upsert",
			userId: input.userId,
		});
		return profile;
	}
}

export class SearchPlayersUseCase {
	constructor(private repo: MatchingRepository) {}
	execute(q: SearchPlayersQuery): Promise<PlayerProfileDto[]> {
		return this.repo.searchPlayers(q);
	}
}

export class SendProposalUseCase {
	constructor(
		private repo: MatchingRepository,
		private audit?: AuditPort,
	) {}
	async execute(input: {
		fromUser: string;
		toUser: string;
		start: Date;
		end: Date;
		message?: string;
	}): Promise<MatchProposalDto> {
		if (input.fromUser === input.toUser)
			throw new TRPCError({ code: "BAD_REQUEST" });
		const p = await this.repo.createProposal(input);
		this.audit?.log({
			level: "info",
			msg: "matching.proposal.send",
			userId: input.fromUser,
			resource: `proposal:${p.id}`,
		});
		return p;
	}
}

export class ActOnProposalUseCase {
	constructor(
		private repo: MatchingRepository,
		private audit?: AuditPort,
	) {}
	async execute(input: {
		userId: string;
		id: ProposalId;
		action: "accept" | "decline";
	}): Promise<MatchProposalDto> {
		const p = await this.repo.findProposal(input.id);
		if (!p || p.toUser !== input.userId)
			throw new TRPCError({ code: "FORBIDDEN" });
		const status = input.action === "accept" ? "accepted" : "declined";
		const updated = await this.repo.updateProposalStatus(input.id, status);
		this.audit?.log({
			level: "info",
			msg: "matching.proposal.act",
			userId: input.userId,
			resource: `proposal:${updated.id}`,
			meta: { status: updated.status },
		});
		return updated;
	}
}

export class ListIncomingProposalsUseCase {
	constructor(private repo: MatchingRepository) {}
	execute(userId: string) {
		return this.repo.listIncoming(userId);
	}
}

export class ListOutgoingProposalsUseCase {
	constructor(private repo: MatchingRepository) {}
	execute(userId: string) {
		return this.repo.listOutgoing(userId);
	}
}

export class GetProposalUseCase {
	constructor(private repo: MatchingRepository) {}
	async execute(input: {
		userId: string;
		id: ProposalId;
	}): Promise<MatchProposalDto> {
		const p = await this.repo.findProposal(input.id);
		if (!p) throw new TRPCError({ code: "NOT_FOUND" });
		if (p.toUser !== input.userId && p.fromUser !== input.userId)
			throw new TRPCError({ code: "FORBIDDEN" });
		return p;
	}
}
