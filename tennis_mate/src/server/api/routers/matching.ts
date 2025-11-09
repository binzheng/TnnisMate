import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { createMatchingUseCases } from "~/server/interfaces/matching/di";

export const matchingRouter = createTRPCRouter({
	upsertProfile: protectedProcedure
		.input(
			z.object({
				level: z.number().int().min(1).max(10),
				area: z.string().optional(),
				available: z.any().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const uc = createMatchingUseCases(ctx.db);
			return uc.upsertProfile.execute({
				userId: ctx.session.user.id,
				level: input.level,
				area: input.area,
				available: input.available,
			});
		}),

	searchPlayers: protectedProcedure
		.input(
			z
				.object({
					levelMin: z.number().optional(),
					levelMax: z.number().optional(),
					area: z.string().optional(),
				})
				.optional(),
		)
		.query(async ({ ctx, input }) => {
			const uc = createMatchingUseCases(ctx.db);
			return uc.searchPlayers.execute(input ?? {});
		}),

	sendProposal: protectedProcedure
		.input(
			z.object({
				toUser: z.string(),
				start: z.coerce.date(),
				end: z.coerce.date(),
				message: z.string().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const uc = createMatchingUseCases(ctx.db);
			return uc.sendProposal.execute({
				fromUser: ctx.session.user.id,
				toUser: input.toUser,
				start: input.start,
				end: input.end,
				message: input.message,
			});
		}),

	actOnProposal: protectedProcedure
		.input(z.object({ id: z.string(), action: z.enum(["accept", "decline"]) }))
		.mutation(async ({ ctx, input }) => {
			const uc = createMatchingUseCases(ctx.db);
			return uc.actOnProposal.execute({
				userId: ctx.session.user.id,
				id: input.id,
				action: input.action,
			});
		}),

	listIncomingProposals: protectedProcedure.query(async ({ ctx }) => {
		const uc = createMatchingUseCases(ctx.db);
		const uid = ctx.session?.user?.id;
		if (!uid) return [];
		return uc.listIncoming.execute(uid);
	}),

	listOutgoingProposals: protectedProcedure.query(async ({ ctx }) => {
		const uc = createMatchingUseCases(ctx.db);
		const uid = ctx.session?.user?.id;
		if (!uid) return [];
		return uc.listOutgoing.execute(uid);
	}),

	getProposal: protectedProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ ctx, input }) => {
			const uc = createMatchingUseCases(ctx.db);
			return uc.getProposal.execute({
				userId: ctx.session.user.id,
				id: input.id,
			});
		}),
});
