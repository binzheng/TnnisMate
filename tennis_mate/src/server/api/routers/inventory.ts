import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { createInventoryUseCases } from "~/server/interfaces/inventory/di";

export const inventoryRouter = createTRPCRouter({
	startCsvImport: protectedProcedure
		.input(
			z.object({
				source: z.string().optional(),
				rows: z.array(z.record(z.string(), z.string())).min(1),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const uc = createInventoryUseCases(ctx.db);
			return uc.startCsvImport.execute({
				source: input.source,
				rows: input.rows,
				userId: ctx.session.user.id,
				requestId: ctx.requestId,
			});
		}),

	listJobs: protectedProcedure.query(async ({ ctx }) => {
		const uc = createInventoryUseCases(ctx.db);
		return uc.listJobs.execute(50);
	}),
});
