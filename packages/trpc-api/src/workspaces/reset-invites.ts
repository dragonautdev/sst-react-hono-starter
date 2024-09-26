import { nanoid } from "../utils/functions";
import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { project } from "@drizzle/schema";
import { TRPCError } from "@trpc/server";

export const resetInviteLink = router({
  resetInviteLink: protectedProcedure
    .input(
      z.object({
        workspaceSlug: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Find the workspace by slug
      const workspace = await ctx.db
        .select()
        .from(project)
        .where(eq(project.slug, input.workspaceSlug))
        .limit(1)
        .execute();

      if (workspace.length === 0) {
        throw new TRPCError({
          message: "Workspace not found",
          code: "NOT_FOUND",
        });
      }

      // Update the workspace with a new invite code
      const updatedInvite = await ctx.db
        .update(project)
        .set({
          inviteCode: nanoid(24),
        })
        .where(eq(project.id, workspace[0].id))
        .returning()
        .execute();

      return updatedInvite[0];
    }),
});
