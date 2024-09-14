import { Adapter } from "sst/auth/adapter";
import { Hono } from "hono";
import { AdapterOptions } from "sst/auth/adapter/adapter";
import { session } from "./session";
import { Accounts } from "@dragonstart/core/accounts";

export const EmailPassAdapter = (() => {
  return function (routes: Hono, ctx: AdapterOptions<any>) {
    routes.post("/authorize", async (c) => {
      const body = await c.req.json();

      if (body.email && body.password) {
        const user = await Accounts.getUserByEmailPassword({
          email: body.email,
          password: body.password,
        });

        if (!user) {
          // TODO: tell the user that they are not authenticated.
          return new Response(
            JSON.stringify({ message: "User does not exist" }),
            {
              status: 404,
              statusText: "Not found",
            }
          );
        }

        const token = await session.create({
          type: "user",
          properties: {
            userId: user.userId
          },
        });

        return new Response(
          JSON.stringify({
            token,
          }),
          {
            status: 200,
          }
        );
      } else {
        new Response(JSON.stringify({ message: "Missing email or password" }), {
          status: 400,
          statusText: "Bad request",
        });
      }
    });
  };
}) satisfies Adapter<{ claims: Record<string, string> }>;
