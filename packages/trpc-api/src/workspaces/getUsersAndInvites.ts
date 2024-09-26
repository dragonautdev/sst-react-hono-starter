import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { eq } from "drizzle-orm";

import { projectInvite, projectUsers, role, users } from "@drizzle/schema";

export const getUsersAndInvites = router({
  getUsersAndInvites: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      // Get invites for a specific workspace
      const invites = await ctx.db
        .select({
          email: projectInvite.email,
          createdAt: projectInvite.createdAt,
        })
        .from(projectInvite)
        .where(eq(projectInvite.projectId, input.projectId));

      // Get users for a specific workspace
      const project_users = await ctx.db
        .select({
          role: projectUsers.role,
          user: {
            id: users.id,
            name: users.name,
            email: users.email,
            image: users.image,
          },
          createdAt: projectUsers.createdAt,
        })
        .from(projectUsers)
        .innerJoin(users, eq(projectUsers.userId, users.id))
        .where(eq(projectUsers.projectId, input.projectId));
      return { project_users, invites };
    }),
});
