import { useUser } from "@dragonstart/core/actor";
import { protectedProcedure, router } from "../trpc";
import { Keys } from "@dragonstart/core/keys";
import { CreateKey } from "./schemas";
import { pick } from "remeda";

export const accountRouter = router({
  createKey: protectedProcedure
    .input(Keys.CreateKey.pick({ name: true }))
    .mutation(async ({ ctx, input }) => {
      const session = useUser();

      const apiKey = await Keys.createApiKey({
        userId: session.userId,
        name: input.name,
      });

      return apiKey;
    }),
  getKeys: protectedProcedure.query(async ({ ctx }) => {
    const session = useUser();

    const apiKeys = await Keys.getApiKeys(session.userId);

    return apiKeys.map((k) => pick(k, ["name", "createdAt", "updatedAt"]));
  }),
  deleteKey: protectedProcedure
    .input(Keys.ApiKey.pick({ id: true, userId: true }))
    .mutation(async ({ ctx, input }) => {
      await Keys.deleteApiKey(input);
    }),
});
