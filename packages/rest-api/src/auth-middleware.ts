import { MiddlewareHandler } from "hono";
import { session } from "@dragonstart/auth/session";
import { ActorContext } from "@dragonstart/core/actor";
import { Keys } from "@dragonstart/core/keys";

export const auth: MiddlewareHandler = async (c, next) => {
  const authHeader =
    c.req.query("authorization") ?? c.req.header("authorization");

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
        next
      );
    }
  }

  const apiKeyHeader = c.req.header("x-api-key");

  if (apiKeyHeader) {
    const apiKey = await Keys.validateApiKey({
      key: apiKeyHeader,
    });
    if (apiKey) {
      return ActorContext.with(
        {
          type: "user",
          properties: {
            userId: apiKey.userId,
          },
        },
        next
      );
    }
  }

  return ActorContext.with({ type: "public", properties: {} }, next);
};
