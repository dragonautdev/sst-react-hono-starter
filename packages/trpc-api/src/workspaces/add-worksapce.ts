import { z } from "zod";

import { TRPCClientError } from "@trpc/client";
import { WorkspaceSchema } from "./schema.js";
import { router, protectedProcedure, publicProcedure } from "../trpc";
import { eq, sql } from "drizzle-orm";
import { project, projectUsers, users } from "@dragonstart/core/drizzle/schema";
import { nanoid } from "../utils/functions/nanoid";

export const addWorkSpace = router({
  addWorkSpace: publicProcedure
    .input(z.object({ slug: z.string(), name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Check if the slug exists
      const existingProject = await ctx.db
        .select()
        .from(project)
        .where(eq(project.slug, input.slug))
        .execute();

      if (existingProject.length > 0) {
        throw new TRPCClientError("Project already in use");
      }

      // // Let's check if the person can create more than one workspace (if applicable)
      // const freeWorkspaces = await ctx.db
      //   .select({ count: sql<number>`count(*)` })
      //   .from(project)
      //   .where(
      //     and(
      //       eq(project.plan, "free"),
      //       exists(
      //         ctx.db
      //           .select()
      //           .from(projectUsers)
      //           .where(
      //             and(
      //               eq(projectUsers.userId, ctx.user?.id!),
      //               eq(projectUsers.role, "owner")
      //             )
      //           )
      //       )
      //     )
      //   )
      //   .execute();

      // if (freeWorkspaces[0].count >= 1) {
      //   throw new TRPCClientError(
      //     "You can only create up to 1 free workspace. Additional workspaces require a paid plan"
      //   );
      // }

      // Insert the workspace and the owner in `projectUsers`
      const workspaceId = nanoid();
      const workspaceResponse = await ctx.db.transaction(async (trx) => {
        // Insert into `project`
        await trx.insert(project).values({
          id: workspaceId,
          name: input.name,
          slug: input.slug,
          billingCycleStart: new Date().getDate(),
          inviteCode: nanoid(24),
          plan: "free",
          updatedAt: sql`CURRENT_TIMESTAMP`,
        });

        // Insert into `projectUsers`
        await trx.insert(projectUsers).values({
          projectId: workspaceId,
          userId: ctx.auth_session?.user?.id!,
          role: "owner",
          updatedAt: sql`CURRENT_TIMESTAMP`,
        });

        // Return the workspace with users
        return trx
          .select({
            slug: project.slug,
            users: projectUsers.role,
          })
          .from(project)
          .leftJoin(projectUsers, eq(project.id, projectUsers.projectId))
          .where(eq(project.id, workspaceId))
          .execute();
      });

      // Update the user's default workspace if not set
      if (ctx?.auth_session?.user?.defaultWorkspace === null) {
        await ctx.db
          .update(users)
          .set({
            defaultWorkspace: workspaceResponse[0].slug,
          })
          .where(eq(users.id, ctx.auth_session.user.id))
          .execute();
      }

      // Parse and return the result
      return WorkspaceSchema.parse({
        ...workspaceResponse[0],
        id: `ws_${workspaceId}`,
      });
    }),
});
