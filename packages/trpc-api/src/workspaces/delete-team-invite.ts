import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { project, projectInvite } from "@drizzle/schema";
import { and, eq } from "drizzle-orm";

export const deleteTeamInvite = router({
  deleteInvite: protectedProcedure
    .input(
      z.object({
        workspaceSlug: z.string(),
        email: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Fetch the workspace/project by its slug
      const workspace = await ctx.db
        .select({
          id: project.id,
        })
        .from(project)
        .where(eq(project.slug, input.workspaceSlug))
        .limit(1);

      if (!workspace[0]?.id) {
        throw new Error("Workspace not found");
      }

      // Delete the invite where email and projectId match
      return await ctx.db
        .delete(projectInvite)
        .where(
          and(
            eq(projectInvite.email, input.email),
            eq(projectInvite.projectId, workspace[0].id)
          )
        )
        .execute();
    }),
});
