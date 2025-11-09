import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { createCatalogUseCases } from "~/server/interfaces/catalog/di";

export const catalogRouter = createTRPCRouter({
	listFacilities: protectedProcedure.query(async ({ ctx }) => {
		const uc = createCatalogUseCases(ctx.db);
		return uc.listFacilities.execute();
	}),

	listCourts: protectedProcedure.query(async ({ ctx }) => {
		const uc = createCatalogUseCases(ctx.db);
		return uc.listCourts.execute();
	}),

	createFacility: protectedProcedure
		.input(z.object({ name: z.string().min(1) }))
		.mutation(async ({ ctx, input }) => {
			const uc = createCatalogUseCases(ctx.db);
			return uc.createFacility.execute(input.name);
		}),

	updateFacility: protectedProcedure
		.input(z.object({ id: z.string().min(1), name: z.string().min(1) }))
		.mutation(async ({ ctx, input }) => {
			const uc = createCatalogUseCases(ctx.db);
			return uc.updateFacility.execute(input.id, input.name);
		}),

	deleteFacility: protectedProcedure
		.input(z.object({ id: z.string().min(1) }))
		.mutation(async ({ ctx, input }) => {
			const uc = createCatalogUseCases(ctx.db);
			await uc.deleteFacility.execute(input.id);
			return { ok: true } as const;
		}),

	createCourt: protectedProcedure
		.input(z.object({ name: z.string().min(1), facilityId: z.string().min(1) }))
		.mutation(async ({ ctx, input }) => {
			const uc = createCatalogUseCases(ctx.db);
			return uc.createCourt.execute(input.name, input.facilityId);
		}),

	updateCourt: protectedProcedure
		.input(z.object({ id: z.string().min(1), name: z.string().min(1) }))
		.mutation(async ({ ctx, input }) => {
			const uc = createCatalogUseCases(ctx.db);
			return uc.updateCourt.execute(input.id, input.name);
		}),

	deleteCourt: protectedProcedure
		.input(z.object({ id: z.string().min(1) }))
		.mutation(async ({ ctx, input }) => {
			const uc = createCatalogUseCases(ctx.db);
			await uc.deleteCourt.execute(input.id);
			return { ok: true } as const;
		}),
});
