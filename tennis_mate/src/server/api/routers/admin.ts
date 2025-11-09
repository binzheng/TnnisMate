import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { createAdminUseCases } from "~/server/interfaces/admin/di";

export const adminRouter = createTRPCRouter({
	kpis: protectedProcedure
		.input(
			z
				.object({
					from: z.coerce.date().optional(),
					to: z.coerce.date().optional(),
				})
				.optional(),
		)
		.query(async ({ ctx, input }) => {
			const uc = createAdminUseCases(ctx.db);
			return uc.kpis.execute({ from: input?.from, to: input?.to });
		}),
});
