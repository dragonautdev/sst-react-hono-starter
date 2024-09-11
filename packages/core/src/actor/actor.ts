import { UnauthorizedError } from "../errors";
import { createContext } from "./context";

export interface UserActorProperties {
  userId: string;
  email: string;
  name: string;
}

export interface UserActor {
  type: "user";
  properties: UserActorProperties;
}

export interface PublicActor {
  type: "public";
  properties: {};
}

type Actor = UserActor | PublicActor;
export const ActorContext = createContext<Actor>();

export function useUser() {
  const actor = ActorContext.use();
  if (actor.type === "user") return actor.properties;
  throw new UnauthorizedError(`Actor is "${actor.type}" not UserActor`);
}

export function useActor() {
  try {
    return ActorContext.use();
  } catch {
    return { type: "public", properties: {} } as PublicActor;
  }
}

export function assertActor<T extends Actor["type"]>(type: T) {
  const actor = useActor();
  if (actor.type !== type)
    throw new UnauthorizedError(`Actor is not "${type}"`);
  return actor as Extract<Actor, { type: T }>;
}
