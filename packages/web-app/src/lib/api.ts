import { TRPCClientError, createTRPCClient, httpBatchLink } from "@trpc/client";
import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@dragonstart/trpc-api/router";
import SuperJSON from "superjson";

export function isTRPCClientError(
  cause: unknown
): cause is TRPCClientError<AppRouter> {
  return cause instanceof TRPCClientError;
}

const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      transformer: SuperJSON,
      url: `${import.meta.env.VITE_API_URL}`,
      headers: async () => {
        const token = localStorage.getItem("session");

        if (token) {
          return {
            authorization: `Bearer ${token}`,
          };
        } else {
          return {};
        }
      },
    }),
  ],
});



export const trpcApi = trpc;

type RouterInputs = inferRouterInputs<AppRouter>
type RouterOutputs = inferRouterOutputs<AppRouter>;

export type UserSession = RouterOutputs['account']['getUser'];