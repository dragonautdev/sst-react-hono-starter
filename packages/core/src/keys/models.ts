import { CreateEntityItem, Entity, EntityItem, Service } from "electrodb";
import { useLocalTableName } from "../utils";
import { Resource } from "sst";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient();

export const ApiKey = new Entity({
  model: {
    service: "keys",
    entity: "ApiKey",
    version: "1",
  },
  attributes: {
    id: {
      type: "string",
      required: true,
    },
    key: {
      type: "string",
      required: true,
    },
    name: {
      type: "string",
      required: true,
    },
    userId: {
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
    byId: {
      pk: {
        field: "pk",
        composite: ["id"],
      },
      sk: {
        field: "sk",
        composite: [],
      },
    },
    apiKey: {
      index: "GSI1",
      pk: {
        field: "gsi1pk",
        composite: ["key"],
      },
      sk: {
        field: "gsi1sk",
        composite: [],
      },
    },
    user: {
      index: "GSI2",
      pk: {
        field: "gsi2pk",
        composite: ["userId"],
      },
      sk: {
        field: "gsi2sk",
        composite: ['key'],
      }
    }
  }
});

export type CreateApiKeyItem = CreateEntityItem<typeof ApiKey>;
export type ApiKeyItem = EntityItem<typeof ApiKey>;

const table = useLocalTableName(process.env.LOCAL_ACCOUNTS_TABLE)
  ? process.env.LOCAL_ACCOUNTS_TABLE
  : Resource.AppDb.name;

export const KeysService = new Service(
  {
    apiKey: ApiKey,
  },
  {
    client,
    table,
  }
);