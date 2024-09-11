import { Entity, CreateEntityItem, EntityItem, Service } from "electrodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { useLocalTableName } from "../utils";
import { Resource } from "sst";

const client = new DynamoDBClient();

export const User = new Entity({
  model: {
    service: "account",
    entity: "User",
    version: "1",
  },
  attributes: {
    userId: {
      type: "string",
      required: true,
    },
    email: {
      type: "string",
      required: true,
    },
    status: {
      type: ["active", "inactive"] as const,
      required: true,
    },
    name: {
      type: "string",
      required: true,
    },
    password: {
      type: "string",
      required: true,
    },
    createdAt: {
      type: "number",
      readOnly: true,
      required: true,
      default: () => Date.now(),
      set: () => Date.now(),
    },
    updatedAt: {
      type: "number",
      watch: "*",
      required: true,
      default: () => Date.now(),
      set: () => Date.now(),
    },
  },
  indexes: {
    user: {
      pk: {
        field: "pk",
        composite: ["email"],
      },
      sk: {
        field: "sk",
        composite: [],
      },
    },
    byId: {
      index: "GSI1",
      pk: {
        field: "gsi1pk",
        composite: ["userId"],
      },
      sk: {
        field: "gsi1sk",
        composite: [],
      },
    },
  },
});

export type CreateUserItem = CreateEntityItem<typeof User>;
export type UserItem = EntityItem<typeof User>;

const table = useLocalTableName(process.env.LOCAL_ACCOUNTS_TABLE)
  ? process.env.LOCAL_ACCOUNTS_TABLE
  : Resource.AppDb.name;

export const AccountService = new Service(
  {
    user: User,
  },
  {
    client,
    table,
  }
);
