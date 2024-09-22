import { appDb, kvStore } from "./databases";
import { trpcApi } from "./trpc-api";

export const app = new sst.aws.Nextjs("dashboard", {
  path: "packages/app",
  link: [appDb, trpcApi],
  environment: {
    NEXT_PUBLIC_APP_DB: appDb.name,
    NEXT_PUBLIC_KV_STORE: kvStore.name,
  },
});
