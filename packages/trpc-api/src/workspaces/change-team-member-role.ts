import { z } from "zod";
import { roles } from "./schema";
import { router, protectedProcedure } from "../trpc";
import { and, eq } from "drizzle-orm";
import { project, projectUsers } from "@drizzle/schema";

export const changeTeamMemberRole = router({
  changeRole: protectedProcedure
    .input(
      z.object({
        role: z.enum(roles),
        userId: z.string(),
        workspaceSlug: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Fetch workspace/project by slug
      const workspace = await ctx.db
        .select({
          id: project.id,
        })
        .from(project)
        .where(eq(project.slug, input.workspaceSlug))
        .limit(1); // Find unique equivalent

      if (!workspace[0]?.id) {
        throw new Error("Workspace not found");
      }

      // Update projectUsers table to change the role
      await ctx.db
        .update(projectUsers)
        .set({ role: input.role })
        .where(
          and(
            eq(projectUsers.userId, input.userId),
            eq(projectUsers.projectId, workspace[0].id)
          )
        )
        .execute();

      return { success: true };
    }),
});
