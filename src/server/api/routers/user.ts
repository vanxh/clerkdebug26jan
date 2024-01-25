import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  me: protectedProcedure.input(z.object({})).query(({ ctx }) => {
    return {
      id: ctx.auth.userId,
      foo: "bar",
    };
  }),
});
