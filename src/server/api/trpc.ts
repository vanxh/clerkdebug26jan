import { TRPCError, initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { auth } from "@clerk/nextjs";

export const createTRPCContext = (opts: {
  headers: Record<string, string>;
  serverSideCall?: boolean;
}) => {
  const clerkAuth = !opts.serverSideCall ? auth() : null;

  console.log(">>> clerkAuth", clerkAuth);
  return {
    auth: clerkAuth,
    headers: opts.headers,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.auth?.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      auth: {
        ...ctx.auth,
        userId: ctx.auth.userId,
      },
    },
  });
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
