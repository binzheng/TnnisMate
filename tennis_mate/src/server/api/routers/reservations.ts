import { z } from "zod";
import { PrismaReservationReader } from "~/server/adapters/reservations/prisma-reservation-adapter";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { DetectConflictsUseCase } from "~/server/core/usecases/reservations/detect-conflicts";
import { createReservationUseCases } from "~/server/interfaces/reservations/di";

const detectInput = z.object({
	courtId: z.string().optional(),
	userId: z.string().optional(),
	start: z.coerce.date(),
	end: z.coerce.date(),
});

export const reservationsRouter = createTRPCRouter({
	detectConflicts: protectedProcedure
		.input(detectInput)
		.query(async ({ ctx, input }) => {
			const reader = new PrismaReservationReader(ctx.db);
			const uc = new DetectConflictsUseCase(reader);
			const conflicts = await uc.execute(input);
			return conflicts.map((c) => ({
				id: c.targetReservationId,
				reason: c.reason,
				start: c.start,
				end: c.end,
			}));
		}),

	createReservation: protectedProcedure
		.input(
			z.object({
				courtId: z.string(),
				start: z.coerce.date(),
				end: z.coerce.date(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const uc = createReservationUseCases(ctx.db);
			return uc.create.execute({
				courtId: input.courtId,
				userId: ctx.session.user.id,
				start: input.start,
				end: input.end,
				requestId: ctx.requestId,
			});
		}),

	updateReservation: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				start: z.coerce.date().optional(),
				end: z.coerce.date().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const uc = createReservationUseCases(ctx.db);
			return uc.update.execute({
				id: input.id,
				start: input.start,
				end: input.end,
				userId: ctx.session.user.id,
				requestId: ctx.requestId,
			});
		}),

	cancelReservation: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const uc = createReservationUseCases(ctx.db);
			await uc.cancel.execute({
				id: input.id,
				userId: ctx.session.user.id,
				requestId: ctx.requestId,
			});
			return { ok: true };
		}),
});
