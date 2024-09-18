import { router, protectedProcedure } from "../trpc";
import { eq } from "drizzle-orm";
import { project, projectUsers } from "@dragonstart/core/drizzle/schema";

export const fetchAllWorkspaces = router({
  fetchAllWorkspaces: protectedProcedure.query(async ({ ctx }) => {
    // Fetch all workspaces the user is part of
    const workspaces = await ctx.db
      .select({
        id: project.id,
        slug: project.slug,
        plan: project.plan,
        users: projectUsers.role, // assuming you want to include the role of users
      })
      .from(project)
      .innerJoin(
        projectUsers,
        eq(project.id, projectUsers.projectId) // Join based on project ID
      )
      .where(eq(projectUsers.userId, ctx?.user.id)); // Only get workspaces where the user is involved

    // Filter free workspaces where the user is an owner
    const freeWorkspaces = workspaces.filter(
      (workspace) =>
        workspace.plan === "free" && workspace.users?.role === "owner"
    );

    return {
      workspaces,
      freeWorkspaces,
      exceedingFreeWorkspaces: freeWorkspaces.length >= 2,
    };
  }),
});
