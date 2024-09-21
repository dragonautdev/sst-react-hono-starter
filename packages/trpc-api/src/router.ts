import { router, createCallerFactory } from "./trpc";
import { sampleRouter } from "./sample/router";
import { accountRouter } from "./account/router";
import { apiKeysRouter } from "./api-keys/router";
import workspace from "./workspaces";

export const appRouter = router({
  account: accountRouter,
  apiKeys: apiKeysRouter,
  sample: sampleRouter,
  workspace: workspace,
});

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
