import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { project } from "@dragonstart/core/drizzle/schema";
import { eq } from "drizzle-orm";

export const editWorkspace = router({
  changeWorkspaceName: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string(),
        updatedName: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const res = await ctx.db
        .update(project)
        .set({
          name: input.updatedName,
        })
        .where(eq(project.id, input.workspaceId))
        .returning(); // Returns updated data
      return res[0]; // Drizzle returns an array, so return the first item
    }),

  changeWorkspaceSlug: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string(),
        updatedSlug: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const res = await ctx.db
          .update(project)
          .set({
            slug: input.updatedSlug,
          })
          .where(eq(project.id, input.workspaceId))
          .returning(); // Returns updated data
        return res[0];
      } catch (error: any) {
        // Handle unique constraint violation (Drizzle error handling)
        if (error.message.includes("unique constraint")) {
          throw new TRPCError({
            message: "Slug already in use",
            code: "BAD_REQUEST",
          });
        }
        throw new TRPCError({
          message: "Something went wrong",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
});
