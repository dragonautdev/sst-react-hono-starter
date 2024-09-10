import { createSessionBuilder } from "sst/auth";
import { UserActorProperties } from "@dragonstart/core/actor";

export const session = createSessionBuilder<{
  user: UserActorProperties;
}>();
