import { Hono } from "hono";
import { handle } from "hono/aws-lambda";
import { compress } from "hono/compress";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { SampleApi } from "./sample";

const app = new Hono();

app.use(logger());
app.use(cors());
app.use(compress());

const routes = app.route("/sample", SampleApi);

export const handler = handle(app);
export type Routes = typeof routes;
