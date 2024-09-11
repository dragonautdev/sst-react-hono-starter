import { Hono } from "hono";
import { handle } from "hono/aws-lambda";
import { compress } from "hono/compress";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { auth } from "./auth-middleware";
import { SampleApi } from "./sample";
import { errorHandler } from "./errors";

const app = new Hono();

app.use(logger());
app.use(cors());
app.use(compress());
app.use(auth);

app.onError(errorHandler);

const routes = app.route("/sample", SampleApi);

export const handler = handle(app);
export type Routes = typeof routes;
