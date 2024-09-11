import { auth } from "./auth";
import { appDb, kvStore } from "./databases";
import { domain } from "./dns";

const APP_URL = $dev ? "http://localhost:3000" : `https://${domain}`;

export const trpcApiFn = new sst.aws.Function("TrpcApiFn", {
  url: true,
  handler: "packages/trpc-api/src/index.handler",
  runtime: "nodejs20.x",
  timeout: "60 seconds",
  transform: {
    function: {
      name: `${$app.name}-${$app.stage}-trpc-api`,
    },
  },
  environment: {
    APP_URL,
    AUTH_PRIVATE_KEY: auth.key.privateKeyPemPkcs8,
  },
  permissions: [
    {
      actions: ["ses:*"],
      resources: ["*"],
    },
  ],
  link: [kvStore, appDb, auth],
});

export const trpcApi = new sst.aws.Router("TrpcApi", {
  routes: {
    "/*": trpcApiFn.url,
  },
  /*domain: {
    name: `trpc.${domain}`,
  },*/
});
