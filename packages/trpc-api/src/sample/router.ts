import { useActor, useUser } from "@dragonstart/core/actor";
import { router, publicProcedure, protectedProcedure } from "../trpc";

export const sampleRouter = router({
  public: publicProcedure.query(({ ctx }) => {

    const actor = useActor();

    if (actor.type === 'public') {
      return {
        message: "Sample API is running. User is not authenticated",
      };
    } else {
      return {
        message: "Sample API is running. User is authenticated as " + actor.properties.name,
      };
    }
    
  }),
  protected: protectedProcedure.query(({ ctx }) => {
    const session = useUser();
    return {
      message: "Protected Sample API is running. User is " + session.name,
    };
  })
});