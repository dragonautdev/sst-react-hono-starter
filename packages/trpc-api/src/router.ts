import { router, createCallerFactory } from './trpc'
import { sampleRouter } from './sample/router'
import { accountRouter } from './account/router';
import { apiKeysRouter } from './api-keys/router';

export const appRouter = router({
  account: accountRouter,
  apiKeys: apiKeysRouter,
  sample: sampleRouter
});

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
