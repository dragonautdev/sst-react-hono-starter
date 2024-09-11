import { CoreError } from "@dragonstart/core/errors";
import { TRPCError, initTRPC } from "@trpc/server";
import { CreateAWSLambdaContextOptions } from "@trpc/server/adapters/aws-lambda";
import { LambdaFunctionURLEvent } from "aws-lambda";
import { session } from "@dragonstart/auth/session";
import { ActorContext } from "@dragonstart/core/actor";
import SuperJSON from "superjson";

// created for each request
export const createContext = async ({
  event,
  context,
}: CreateAWSLambdaContextOptions<LambdaFunctionURLEvent>) => {
  return {
    event,
    context,
  };
};

export type ApiRequestContext = Awaited<ReturnType<typeof createContext>>;

export const t = initTRPC.context<ApiRequestContext>().create({
  transformer: SuperJSON,
});

export const router = t.router;
export const publicProcedure = t.procedure;

const errorHandlerMiddleware = t.middleware(({ ctx, next }) => {
  try {
    return next({ ctx });
  } catch (error: any) {
    if (error instanceof CoreError) {
      if (error.code === "Unauthorized") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: error.message,
          cause: error,
        });
      } else if (error.code === "NotFound") {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: error.message,
          cause: error,
        });
      } else if (error.code === "Forbidden") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: error.message,
          cause: error,
        });
      } else if (error.code === "ValidationError") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: error.message,
          cause: error,
        });
      } else if (error.code === "InternalError") {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message,
          cause: error,
        });
      } else {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: error.message,
          cause: error,
        });
      }
    } else if (error instanceof TRPCError) {
      throw error;
    } else {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error.message,
        cause: error,
      });
    }
  }
});

const authMiddleware = t.middleware(async ({ ctx, next }) => {
  const authHeader = ctx.event.headers["authorization"];

  if (authHeader) {
    const match = authHeader.match(/^Bearer (.+)$/);
    if (!match) {
      throw new Error("Bearer token not found or improperly formatted");
    }
    const bearerToken = match[1];

    const result = await session.verify(bearerToken!);
    if (result.type === "user") {
      return ActorContext.with(
        {
          type: "user",
          properties: result.properties,
        },
        () =>
          next({
            ctx: ctx,
          })
      );
    }
  }

  throw new TRPCError({
    code: "UNAUTHORIZED",
    message: "Unauthorized",
  });
});

export const protectedProcedure = t.procedure.use(
  errorHandlerMiddleware.unstable_pipe(authMiddleware)
);
