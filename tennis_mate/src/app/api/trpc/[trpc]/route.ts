import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import type { NextRequest } from "next/server";

import { env } from "~/env";
import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a HTTP request (e.g. when you make requests from Client Components).
 */
const createContext = async (req: NextRequest) => {
	return createTRPCContext({
		headers: req.headers,
	});
};

const handler = (req: NextRequest) =>
	fetchRequestHandler({
		endpoint: "/api/trpc",
		req,
		router: appRouter,
		createContext: () => createContext(req),
		onError:
			env.NODE_ENV === "development"
				? ({ path, error }) => {
						console.error(
							`❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
						);
					}
				: undefined,
		// Set HTTP status and headers for certain errors
		responseMeta({ errors, type }) {
			const unauthorized = errors.find((e) => e.code === "UNAUTHORIZED");
			if (unauthorized) {
				// Compute callback from header or current path
				const ref =
					req.headers.get("x-trpc-referrer") ??
					req.nextUrl.pathname + req.nextUrl.search;
				const login = new URL("/login", req.nextUrl.origin);
				login.searchParams.set("callbackUrl", ref);
				return {
					status: 401,
					headers: {
						// Hint for clients; fetch won't auto-navigate, but clients can read this header
						"x-redirect-to": login.toString(),
					},
				};
			}
			return {};
		},
	});

export { handler as GET, handler as POST };
