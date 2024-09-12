import { router } from './trpc'
import { sampleRouter } from './sample/router'
import { accountRouter } from './account/router';

export const appRouter = router({
  account: accountRouter,
  sample: sampleRouter
});

export type AppRouter = typeof appRouter;
