import { appDb, kvStore, postgresDb } from "./databases";
import { trpcApi } from "./trpc-api";

export const app = new sst.aws.Nextjs("dashboard", {
  path: "packages/app",
  link: [appDb, trpcApi, postgresDb],
  environment: {
    NEXT_PUBLIC_APP_DB: appDb.name,
    NEXT_PUBLIC_KV_STORE: kvStore.name,
    NEXT_PUBLIC_TRPC_API_URL: trpcApi.url,
  },
});
