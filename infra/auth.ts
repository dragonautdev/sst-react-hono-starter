import { appDb, kvStore } from "./databases";
import { domain } from "./dns";

export const auth = new sst.aws.Auth("Auth", {
  authenticator: {
    permissions: [
      {
        actions: ["ses:*"],
        resources: ["*"],
      },
    ],
    handler: "packages/auth/src/index.handler",
    environment: {
      SST_APP: $app.name,
      SST_STAGE: $app.stage,
      CLIENT_ID: process.env.CLIENT_ID!,
      AUTH_FRONTEND_URL: $dev ? 'http://localhost:3000' : `https://${domain}`,
      SENDER_EMAIL: process.env.SENDER_EMAIL!,
    },
    link: [kvStore, appDb],
  },
});

export const authApiDomain = new sst.aws.Router('AuthApiDomain', {
  routes: {
    '/*': auth.url
  },
  /*domain: {
    name: `auth${domain}`,
  }*/
})