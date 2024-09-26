import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { project, projectUsers } from "@drizzle/schema";
import { TRPCClientError } from "@trpc/client";

export const getSpecificWorkSpace = router({
  getSpecificWorkspace: protectedProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      // Fetch the workspace by slug
      const workspace = await ctx.db
        .select({
          id: project.id,
          slug: project.slug,
          plan: project.plan,
          users: projectUsers.role, // assuming users role is needed
        })
        .from(project)
        .innerJoin(
          projectUsers,
          eq(project.id, projectUsers.projectId) // Joining based on project ID
        )
        .where(eq(project.slug, input.slug))
        .limit(1);

      if (workspace.length === 0) {
        throw new TRPCClientError("No Workspace found with this slug");
      }

      const fetchedWorkspace = workspace[0];

      return {
        workspace: fetchedWorkspace,
        isOwner: fetchedWorkspace?.users && fetchedWorkspace.users === "owner",
        nextPlan: fetchedWorkspace?.plan,
      };
    }),
});
