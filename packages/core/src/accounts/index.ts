import { z } from "zod";
import { AccountService, CreateUserItem, UserItem } from "./models";
import { fn } from "../utils/fn";
import { createId, hashPassword } from "../utils";

export module Accounts {

  export type User = UserItem;

  export const CreateUser = z.object({
    email: z.string().email(),
    name: z.string(),
    password: z.string().optional().default(''),
  })

  export const getUser = async (email: string): Promise<User | null> => {
    try {
      const user = await AccountService.entities.user
        .get({
          email,
        })
        .go();

      if (!user || !user.data || user.data.status !== "active") {
        return null;
      }

      return user.data;
    } catch (error) {
      return null;
    }
  };

  export const getUserById = async (userId: string): Promise<User | null> => {
    try {
      const user = await AccountService.entities.user
        .query.byId({
          userId
        })
        .where((user, op) => op.eq(user.status, "active"))
        .go();

      if (!user || !user.data || !user.data.length) {
        return null;
      }

      return user.data[0];
    } catch (error) {
      return null;
    }
  };

  export const createUser = fn(CreateUser, async (input): Promise<User> => {
    const data = {
      ...input,
      userId: createId(),
      status: 'active' as const,
      password: hashPassword(input.password ?? `default`),
    }
      
    const user = await AccountService.entities.user.create(data).go();
    return user.data;
  });

  export const getUserByEmailPassword = fn(CreateUser.pick({ email: true, password: true }), async (input): Promise<UserItem | null> => {
    const user = await AccountService.entities.user
      .query.user({
        email: input.email
      })
      .where((user, op) => op.eq(user.status, "active"))
      .go();

    if (!user || !user.data || !user.data.length) {
      return null;
    }

    const userData = user.data[0];

    if (userData.password !== hashPassword(input.password)) {
      return null;
    }

    return userData;
  });
}
