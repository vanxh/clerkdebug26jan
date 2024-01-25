import type { NextRequest } from "next/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { createTRPCContext } from "@/server/api/trpc";
import { appRouter } from "@/server/api/root";

export const runtime = "edge";

const handler = async (req: NextRequest) => {
  const response = await fetchRequestHandler({
    endpoint: "/api/trpc",
    router: appRouter,
    req,
    createContext: () =>
      createTRPCContext({
        headers: Object.fromEntries(req.headers.entries()),
      }),
    onError({ error, path }) {
      console.error(`>>> tRPC Error on '${path}'`, error);
    },
  });

  return response;
};

export { handler as GET, handler as POST };
