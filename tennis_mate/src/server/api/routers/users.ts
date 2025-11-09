import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { hashPassword } from "~/server/auth/password";
import { createUsersUseCases } from "~/server/interfaces/users/di";

export const usersRouter = createTRPCRouter({
	list: protectedProcedure.query(async ({ ctx }) => {
		const uc = createUsersUseCases(ctx.db);
		return uc.list.execute(ctx.session.user.id);
	}),

	create: protectedProcedure
		.input(
			z.object({
				email: z.string().email(),
				name: z.string().optional(),
				role: z.enum(["player", "coach", "operator", "admin"]).optional(),
				password: z.string().min(6).optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const uc = createUsersUseCases(ctx.db);
			const passwordHash = input.password
				? hashPassword(input.password)
				: undefined;
			return uc.create.execute(ctx.session.user.id, { ...input, passwordHash });
		}),

	update: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				email: z.string().email().optional(),
				name: z.string().optional(),
				role: z.enum(["player", "coach", "operator", "admin"]).optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const uc = createUsersUseCases(ctx.db);
			return uc.update.execute(ctx.session.user.id, input);
		}),

	remove: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const uc = createUsersUseCases(ctx.db);
			await uc.remove.execute(ctx.session.user.id, input.id);
			return { ok: true } as const;
		}),

	resetPassword: protectedProcedure
		.input(z.object({ id: z.string(), password: z.string().min(6) }))
		.mutation(async ({ ctx, input }) => {
			const uc = createUsersUseCases(ctx.db);
			const passwordHash = hashPassword(input.password);
			await uc.resetPassword.execute(ctx.session.user.id, {
				id: input.id,
				passwordHash,
			});
			return { ok: true } as const;
		}),
});
