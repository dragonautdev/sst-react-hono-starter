import { TRPCClientError } from "@trpc/client";
import { router, protectedProcedure } from "../trpc";
import { eq, and, sql } from "drizzle-orm";

import { z } from "zod";
import {
  project,
  projectInvite,
  projectUsers,
} from "../../../core/src/drizzle/schema";

export const acceptInvite = router({
  acceptInvite: protectedProcedure
    .input(
      z.object({
        email: z.string(),
        workspaceSlug: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Fetch the invite with project details
      const invite = await ctx.db
        .select({
          expires: projectInvite.expires,
          project: {
            id: project.id,
            slug: project.slug,
            plan: project.plan,
          },
        })
        .from(projectInvite)
        .innerJoin(project, eq(projectInvite.projectId, project.id))
        .where(
          and(
            eq(projectInvite.email, input.email),
            eq(project.slug, input.workspaceSlug)
          )
        )
        .then((result) => result[0]); // Fetch the first result

      if (!invite) {
        throw new TRPCClientError("Invalid Invite");
      }

      if (new Date(invite.expires) < new Date()) {
        throw new TRPCClientError("Invite expired");
      }

      const workspace = invite.project;

      // Create a new project user and delete the invite
      await Promise.all([
        // ctx.db
        //   .insert(projectUsers)
        //   .values({
        //     projectId: workspace.id,
        //     userId: ctx.auth_session.user?.id!,
        //     role: "member",
        //   })
        //   .execute(),

        ctx.db.insert(projectUsers).values({
          updatedAt: sql`CURRENT_TIMESTAMP`,
          projectId: workspace.id,
          userId: ctx.auth_session?.user?.id!,
          role: "member",
        }),

        ctx.db
          .delete(projectInvite)
          .where(
            and(
              eq(projectInvite.email, input.email),
              eq(projectInvite.projectId, workspace.id)
            )
          )
          .execute(),
      ]);

      return { success: true };
    }),
});
