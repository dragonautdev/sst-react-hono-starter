import { AuthHandler } from "sst/auth";
import { GoogleAdapter, LinkAdapter } from "sst/auth/adapter";
import { handle } from "hono/aws-lambda";
import { session } from "./lib/session";
import { Resource } from "sst";
import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import {z} from "zod";
import { EmailPassAdapter } from "./lib/email-pass-adapter";

const MAIN_APP_URL =
  process.env.AUTH_FRONTEND_URL || "http://localhost:3000";
const MAIN_APP_LOGIN = `${MAIN_APP_URL}/auth/sign-in`;

export const app = AuthHandler({
  session,
  providers: {
    link: LinkAdapter({
      onLink: async (link, claims) => {
        const ses = new SESv2Client({});

        const email = z.string().email().safeParse(claims.email);

        if (!email.success) {
          return new Response("ok", {
            status: 302,
            headers: {
              Location: MAIN_APP_LOGIN,
            },
          });
        }
        
        const emailCmd = new SendEmailCommand({
          Destination: {
            ToAddresses: [email.data],
          },
          FromEmailAddress: `Test <test@example.com>`,
          Content: {
            Simple: {
              Body: {
                Html: {
                  Data: `Here's your login link: <br><a href="${link}" >${link}</a>`,
                },
                Text: {
                  Data: `Here's your login link: ${link}`,
                },
              },
              Subject: {
                Data: `Dragonstart Login Link`,
              },
            },
          },
        });
        await ses.send(emailCmd);
        return new Response("ok", {
          status: 302,
          headers: {
            Location: `${MAIN_APP_LOGIN}?link=sent`,
          },
        });
      },
    }),
    classic: EmailPassAdapter(),
  },
  callbacks: {
    auth: {
      
      async error(error, req) {
        
        console.error(error);

        return new Response("ok", {
          status: 302,
          headers: {
            Location: `${MAIN_APP_LOGIN}?error=unauthorized`,
          },
        });
      },
      async allowClient(clientID, redirect, req) {
        return true;
      },
      async success(ctx, input, req) {

        const redirectResponse = new Response("ok", {
          status: 302,
          headers: {
            Location: `${MAIN_APP_LOGIN}?error=unauthorized`,
          },
        });

        try {
          let user: UserItem | undefined;
          let email;

          if (input.provider === "classic") {
            user = (input as any).claims as UserItem;
          } else if (input.provider === "google") {
            email = (input as any).tokenset.claims().email;
            if (!email) {
              console.log("Unauthorized");
              return redirectResponse;
            }
          } else if (input.provider === "link") {
            email = (input as any).claims.email;

            if (!email) {
              console.log("Unauthorized");
              return redirectResponse;
            }
          }

          if (!user) {
            const userData = await AccountService.entities.user
              .get({
                email,
              })
              .go();

            if (!userData || !userData.data || userData.data.status !== 'active' ) {
              return new Response("ok", {
                status: 302,
                headers: {
                  Location: `${MAIN_APP_LOGIN}?error=not-registered`,
                },
              });
            }

            user = userData.data;
          }

          const assignment = assignedAccounts.data.userAssignment[0];

          const HOURS = 60 * 60 * 1000;

          return ctx.session({
            type: "user",
            expiresIn: 30 * 24 * HOURS,
            properties: {
              userId: user.userId,
              email: user.email,
              name: user.name,
            },
          });
        } catch (error) {
          console.log(error);
          return redirectResponse;
        }
      },
    },
  },
});

export const handler = handle(app as any);
