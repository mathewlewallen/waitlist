import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

// Import Clerk auth – adjust this import if your Clerk setup differs.
import { auth } from "@clerk/nextjs/server";
// Import your Prisma client instance.
import { prisma } from "@/lib/db";

/**
 * Create a tRPC context.
 * Here we await Clerk's auth() and cast the result so that we know a session has a user.
 */
export const createTRPCContext = async (opts: { headers: Headers }) => {
  // Cast auth() result to include a user object with an id.
  const session = (await auth()) as unknown as { user: { id: string } } | null;
  return {
    prisma,
    session,
    ...opts,
  };
};

/**
 * Initialize tRPC.
 * We set up the transformer and an error formatter that flattens Zod errors.
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * Create a server-side caller factory.
 * (Used for making server-side calls to your API.)
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * Export a router creator.
 */
export const createTRPCRouter = t.router;

/**
 * Middleware for adding a timing delay (in development).
 */
const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();
  if (t._config.isDev) {
    const waitMs = Math.floor(Math.random() * 400) + 100;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }
  const result = await next();
  const end = Date.now();
  console.log(`[TRPC] ${path} took ${end - start}ms to execute`);
  return result;
});

/**
 * Public procedure helper.
 */
export const publicProcedure = t.procedure.use(timingMiddleware);

/**
 * Protected procedure helper.
 * This middleware ensures that the session exists and includes a user.
 */
export const protectedProcedure = t.procedure
  .use(timingMiddleware)
  .use(({ ctx, next }) => {
    if (!ctx.session?.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next({
      ctx: {
        session: { ...ctx.session, user: ctx.session.user },
      },
    });
  });
