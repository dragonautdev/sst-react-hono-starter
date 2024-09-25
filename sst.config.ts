/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "dargonstart",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      providers: {
        aws: {
          region: "us-east-1",
          profile: "dragonadmin",
        },
      },
    };
  },
  async run() {
    const infra = await import("./infra");
    return {
      restApi: infra.restApi.url,
      trpcApi: infra.trpcApi.url,
      app: infra.app.url,
    };
  },
});
