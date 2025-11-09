import {
  defaultShouldDehydrateQuery,
  QueryClient,
  QueryCache,
  MutationCache,
} from "@tanstack/react-query";
import SuperJSON from "superjson";

export const createQueryClient = () => {
  const handleUnauthorized = (err: unknown) => {
    const anyErr = err as any;
    const code = anyErr?.data?.code ?? anyErr?.shape?.code ?? anyErr?.code;
    if (code !== "UNAUTHORIZED") return;
    if (typeof window === "undefined") return; // SSR: do nothing

    // Avoid redirect loops and skip certain routes
    const path = window.location?.pathname ?? "/";
    if (path === "/login" || path.startsWith("/api/")) return;

    // Prevent multiple simultaneous redirects
    const w = window as any;
    if (w.__tm_redirecting) return;
    w.__tm_redirecting = true;

    const cb = encodeURIComponent(path + (window.location?.search ?? ""));
    window.location.href = `/login?callbackUrl=${cb}`;
  };

  return new QueryClient({
    queryCache: new QueryCache({
      onError: handleUnauthorized,
    }),
    mutationCache: new MutationCache({
      onError: handleUnauthorized,
    }),
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 30 * 1000,
        // Avoid retry loops for auth errors; redirect immediately instead
        retry: (failureCount, error) => {
          const anyErr = error as any;
          const code = anyErr?.data?.code ?? anyErr?.shape?.code ?? anyErr?.code;
          // Don't retry for auth-related errors
          if (code === "UNAUTHORIZED" || code === "FORBIDDEN") return false;
          // keep React Query's default behaviour for other errors (3 tries)
          return failureCount < 3;
        },
      },
      dehydrate: {
        serializeData: SuperJSON.serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === "pending",
      },
      hydrate: {
        deserializeData: SuperJSON.deserialize,
      },
    },
  });
};
