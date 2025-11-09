import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { createLessonUseCases } from "~/server/interfaces/lessons/di";

export const lessonsRouter = createTRPCRouter({
  listSlots: protectedProcedure
    .query(async ({ ctx }) => {
      const uc = createLessonUseCases(ctx.db);
      return uc.listSlots.execute();
    }),

  createSlot: protectedProcedure
    .input(z.object({ courtId: z.string(), coachId: z.string().optional(), capacity: z.number().int().min(1), start: z.coerce.date(), end: z.coerce.date() }))
    .mutation(async ({ ctx, input }) => {
      const uc = createLessonUseCases(ctx.db);
      return uc.createSlot.execute(ctx.session.user.id, input);
    }),

  updateSlot: protectedProcedure
    .input(z.object({ id: z.string(), capacity: z.number().int().min(1).optional(), start: z.coerce.date().optional(), end: z.coerce.date().optional(), coachId: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const uc = createLessonUseCases(ctx.db);
      return uc.updateSlot.execute(ctx.session.user.id, input);
    }),

  deleteSlot: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const uc = createLessonUseCases(ctx.db);
      await uc.deleteSlot.execute(ctx.session.user.id, input.id);
      return { ok: true } as const;
    }),

  searchCandidateSlots: protectedProcedure
    .input(z.object({ start: z.coerce.date().optional(), end: z.coerce.date().optional(), courtId: z.string().optional(), coachId: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const uc = createLessonUseCases(ctx.db);
      return uc.searchCandidateSlots.execute(input);
    }),

  bulkChangeReservations: protectedProcedure
    .input(z.object({ reservationIds: z.array(z.string()).min(1), targetSlotId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const uc = createLessonUseCases(ctx.db);
      const updated = await uc.bulkChangeReservations.execute(ctx.session.user.id, input.reservationIds, input.targetSlotId);
      return { updated };
    }),
});
