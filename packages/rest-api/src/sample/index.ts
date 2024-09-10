import { Hono } from "hono";

export const SampleApi = new Hono();

SampleApi.get("/", (c) => {
  return c.json({
    message: "Sample API is running"
  });
});

