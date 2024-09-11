import { authApiDomain } from "./auth";
import { trpcApi } from "./trpc-api";

export const webApp = new sst.aws.StaticSite("WebApp", {
  path: "packages/web-app",
  build: {
    command: "pnpm build",
    output: "dist",
  },
  indexPage: "index.html",
  errorPage: "index.html",
  environment: {
    VITE_AUTH_URL: authApiDomain.url,
    VITE_API_URL: trpcApi.url
  }
})