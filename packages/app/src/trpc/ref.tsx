"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { trpc } from "./trpc";
import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import { ReactNode, useState } from "react";
import { AppRouter } from "@dragonstart/trpc-api/router";


interface TRPCProviderProps {
  children: ReactNode;
}

export function TRPCProvider({ children }: TRPCProviderProps) {
  const [queryClient] = useState(() => new QueryClient());

  const trpcClient = trpc;

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
