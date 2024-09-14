import { z } from "zod";
import { ApiKeyItem, KeysService } from "./models";
import { fn } from "../utils/fn";
import { randomBytes } from "crypto";
import { createId, hashPassword } from "../utils";

const generateKey = (
  size: number = 32,
  format: "base64" | "hex" = "base64"
) => {
  const buffer = randomBytes(size);
  return buffer.toString(format);
};

const API_KEY_PREFIX = "apk_";

export namespace Keys {
  export const ApiKey = z.object({
    id: z.string(),
    key: z.string(),
    name: z.string(),
    userId: z.string(),
    createdAt: z.number(),
    updatedAt: z.number(),
  });

  export type ApiKey = z.infer<typeof ApiKey>;

  export const CreateKey = z.object({
    userId: z.string().min(1),
    name: z.string().min(1),
  });

  export const ValidateKey = z.object({
    key: z.string().min(1),
  });

  export const createApiKey = fn(CreateKey, async (input): Promise<string> => {
    const key = `${API_KEY_PREFIX}${generateKey()}`;
    await KeysService.entities.apiKey
      .create({
        id: createId(),
        key: hashPassword(key),
        name: input.name,
        userId: input.userId,
      })
      .go();

    return key;
  });

  export const validateApiKey = fn(
    ValidateKey,
    async (input): Promise<ApiKey | null> => {
      const key = await KeysService.entities.apiKey.query
        .apiKey({
          key: hashPassword(input.key),
        })
        .go();

      if (!key || !key.data.length) {
        return null;
      }
      return key.data[0];
    }
  );

  export const getApiKeys = fn(CreateKey.shape.userId, async (userId) => {
    const keys = await KeysService.entities.apiKey.query
      .user({
        userId,
      })
      .go();

    if (!keys || !keys.data.length) {
      return [];
    }

    return keys.data;
  });

  export const deleteApiKey = fn(
    ApiKey.pick({ id: true, userId: true }),
    async (input) => {
      await KeysService.entities.apiKey
        .delete({
          id: input.id,
        })
        .where((key, op) => op.eq(key.userId, input.userId))
        .go();
    }
  );
}
