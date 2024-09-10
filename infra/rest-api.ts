import { kvStore } from "./databases";
import { domain } from "./dns";

const APP_URL = $dev ? "http://localhost:3000" : `https://${domain}`;

const restApiFn = new sst.aws.Function("RestApi", {
  url: true,
  handler: "packages/rest-api/src/index.handler",
  runtime: "nodejs20.x",
  timeout: "60 seconds",
  transform: {
    function: {
      name: `${$app.name}-${$app.stage}-rest-api`,
    },
  },
  permissions: [
    {
      actions: ["ses:*"],
      resources: ["*"],
    },
  ],
  environment: {
    APP_URL,
    // AUTH_PRIVATE_KEY: auth.key.privateKeyPemPkcs8,
  },
  link: [
    kvStore,
  ],
});

export const restApi = new sst.aws.Router("ApiRouter", {
  routes: {
    "/*": restApiFn.url,
  },
  /*domain: {
    name: `api.${domain}`,
  },*/
});