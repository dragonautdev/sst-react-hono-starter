import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { hashToken } from "../utils/functions";
import { randomBytes } from "crypto";
import { eq } from "drizzle-orm";
// import { sendEmail } from "~/emails";
// import WorkspaceInvite from "~/emails/workspace-invite";


import { projectUsers, projectInvite, verificationTokens } from "@dragonstart/core/drizzle/schema";
export const invites = router({
  sendInvite: protectedProcedure
    .input(
      z.object({
        email: z.string(),
        workspaceId: z.string(),
        usersLimit: z.number(),
        workspaceName: z.string(),
        workspaceSlug: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [alreadyInWorkspace] =
        await Promise.all([
          ctx.db
            .select()
            .from(projectUsers)
            .where(eq(projectUsers.projectId, input.workspaceId))
            .limit(1)
            .execute(),
          // ctx.db
          //   .select()
          //   .from(projectUsers)
          //   .where({
          //     projectId: input.workspaceId,
          //   })
          //   .count()
          //   .execute(),
          // ctx.db
          //   .select()
          //   .from(projectInvite)
          //   .where({
          //     projectId: input.workspaceId,
          //   })
          //   .count()
          //   .execute(),
        ]);

      if (alreadyInWorkspace.length > 0) {
        throw new TRPCError({
          message: "User already exists in this workspace.",
          code: "BAD_REQUEST",
        });
      }

      // Uncomment and handle usersLimit check
      // if (workspaceUserCount[0].count + workspaceInviteCount[0].count >= input.usersLimit) {
      //   throw new TRPCError({
      //     message: "User limit exceeded.",
      //     code: "BAD_REQUEST",
      //   });
      // }

      const token = randomBytes(32).toString("hex");
      const TWO_WEEKS_IN_SECONDS = 60 * 60 * 24 * 14;
      const expires = new Date(Date.now() + TWO_WEEKS_IN_SECONDS * 1000);

      try {
        await ctx.db
          .insert(projectInvite)
          .values({
            email: input.email,
            expires: expires.toISOString(),
            projectId: input.workspaceId,
          })
          .execute();
      } catch (error) {
        // Handle the specific error code for unique constraint
        if (error?.code === "23505") {
          // Replace with Drizzle's unique constraint error code
          throw new TRPCError({
            message: "User has already been invited to this workspace",
            code: "BAD_REQUEST",
          });
        }
      }

      await ctx.db
        .insert(verificationTokens)
        .values({
          identifier: input.email,
          token: await hashToken(token, { secret: true }),
          expires,
        })
        .execute();

      const params = new URLSearchParams({
        callbackUrl: `${process.env.NEXTAUTH_URL}/?invite=true`,
        email: input.email,
        token,
        workspaceSlug: input.workspaceSlug,
      });

      const url = `${process.env.NEXTAUTH_URL}/invites?email=${input.email}&workspaceSlug=${input.workspaceSlug}`;

      // return await sendEmail({
      //   subject: `You've been invited to join a workspace on ${process.env.NEXT_PUBLIC_APP_NAME}`,
      //   email: input.email,
      //   react: WorkspaceInvite({
      //     email: input.email,
      //     appName: process.env.NEXT_PUBLIC_APP_NAME as string,
      //     url,
      //     workspaceName: input.workspaceName,
      //     workspaceUser: ctx?.session?.user?.name || null,
      //     workspaceUserEmail: ctx?.session?.user?.email || null,
      //   }),
      // });
    }),
});
