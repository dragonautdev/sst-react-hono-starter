import { useActor, useUser } from "@dragonstart/core/actor";
import { Hono } from "hono";

export const SampleApi = new Hono();

SampleApi.get("/private", (c) => {
  const session = useUser();
  return c.json({
    message: "Sample API is running. User is " + session.userId,
  });
});

SampleApi.get("/public", (c) => {
  const actor = useActor(); 

  if (actor.type === 'public') {
    return c.json({
      message: "Sample API is running. User is not authenticated",
    });
  } else {
    return c.json({
      message: "Sample API is running. User is authenticated",
    });
  }
  
});

