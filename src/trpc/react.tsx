"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { loggerLink, unstable_httpBatchStreamLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import { useState } from "react";

import { type AppRouter } from "@/server/api/root";
import { getUrl, transformer } from "./shared";

export const trpc = createTRPCReact<AppRouter>();

export function TRPCReactProvider(props: {
  children: React.ReactNode;
  headers?: Headers;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 1000,
          },
        },
      }),
  );

  const [trpcClient] = useState(() =>
    trpc.createClient({
      transformer,
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        unstable_httpBatchStreamLink({
          url: getUrl(),
          headers: Object.fromEntries(new Map(props.headers)),
        }),
      ],
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryStreamedHydration transformer={transformer}>
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          {props.children}
        </trpc.Provider>
      </ReactQueryStreamedHydration>
    </QueryClientProvider>
  );
}
