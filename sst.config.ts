/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "app-starter",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
    const infra = await import("./infra");

    return {
      adminApp: infra.web.url,
      auth: infra.authApiDomain.url,
      restApi: infra.apiV2.url,
    };
  },
});
