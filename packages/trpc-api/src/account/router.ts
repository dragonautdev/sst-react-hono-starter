import { useUser } from "@dragonstart/core/actor";
import { router, protectedProcedure } from "../trpc";

export const accountRouter = router({
  getUser: protectedProcedure.query(({ ctx }) => {
    const session = useUser();

    return {
      ...session
    };
  })
});