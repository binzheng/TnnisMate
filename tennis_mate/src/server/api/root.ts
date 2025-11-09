import { postRouter } from "~/server/api/routers/post";
import { reservationsRouter } from "~/server/api/routers/reservations";
import { catalogRouter } from "~/server/api/routers/catalog";
import { lessonsRouter } from "~/server/api/routers/lessons";
import { matchingRouter } from "~/server/api/routers/matching";
import { inventoryRouter } from "~/server/api/routers/inventory";
import { scoresRouter } from "~/server/api/routers/scores";
import { usersRouter } from "~/server/api/routers/users";
import { adminRouter } from "~/server/api/routers/admin";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  reservations: reservationsRouter,
  catalog: catalogRouter,
  lessons: lessonsRouter,
  matching: matchingRouter,
  inventory: inventoryRouter,
  scores: scoresRouter,
  users: usersRouter,
  admin: adminRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
