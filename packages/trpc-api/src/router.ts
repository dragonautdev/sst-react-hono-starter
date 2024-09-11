import { router } from './trpc'
import { sampleRouter } from './sample/router'

export const appRouter = router({
  sample: sampleRouter
});

export type AppRouter = typeof appRouter;
