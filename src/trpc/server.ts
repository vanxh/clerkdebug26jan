import { loggerLink, unstable_httpBatchStreamLink } from "@trpc/client";
import { headers } from "next/headers";

import { type AppRouter } from "@/server/api/root";
import { getUrl, transformer } from "./shared";
import { experimental_createTRPCNextAppDirServer } from "@trpc/next/app-dir/server";

export const trpc = experimental_createTRPCNextAppDirServer<AppRouter>({
  config: () => ({
    transformer,
    links: [
      loggerLink({
        enabled: (op) =>
          process.env.NODE_ENV === "development" ||
          (op.direction === "down" && op.result instanceof Error),
      }),
      unstable_httpBatchStreamLink({
        url: getUrl(),
        headers: Object.fromEntries(headers().entries()),
      }),
    ],
  }),
});
