import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { createScoreUseCases } from "~/server/interfaces/scores/di";

export const scoresRouter = createTRPCRouter({
	addScore: protectedProcedure
		.input(
			z.object({
				opponentId: z.string(),
				date: z.coerce.date(),
				result: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const uc = createScoreUseCases(ctx.db);
			return uc.addScore.execute({
				playerId: ctx.session.user.id,
				opponentId: input.opponentId,
				date: input.date,
				result: input.result,
			});
		}),

	myHistory: protectedProcedure
		.input(
			z
				.object({
					from: z.coerce.date().optional(),
					to: z.coerce.date().optional(),
				})
				.optional(),
		)
		.query(async ({ ctx, input }) => {
			const uc = createScoreUseCases(ctx.db);
			return uc.myHistory.execute({
				playerId: ctx.session.user.id,
				from: input?.from,
				to: input?.to,
			});
		}),

	rankingSummary: protectedProcedure.query(async ({ ctx }) => {
		const uc = createScoreUseCases(ctx.db);
		return uc.rankingSummary.execute(20);
	}),
});
