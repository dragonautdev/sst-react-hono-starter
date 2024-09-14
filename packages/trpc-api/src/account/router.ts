import { useUser } from "@dragonstart/core/actor";
import { Accounts } from "@dragonstart/core/accounts";
import { router, protectedProcedure } from "../trpc";
import { NotFoundError } from "@dragonstart/core/errors";
import { pick } from 'remeda'
export const accountRouter = router({
  getUser: protectedProcedure.query(async ({ ctx }) => {
    const session = useUser();

    const user = await Accounts.getUserById(session.userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return pick(user, ['userId', 'email', 'name']);
    
  })
});