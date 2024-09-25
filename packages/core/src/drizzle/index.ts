// import { drizzle } from "drizzle-orm/postgres-js";
// import postgres from "postgres";
// // import { users } from "./schema";

// const connectionString = process.env.DATABASE_URL;

// export const client = postgres(connectionString!, { prepare: false });
// export const db = drizzle(client);

import { Resource } from "sst";
import { drizzle } from "drizzle-orm/aws-data-api/pg";
import { RDSDataClient } from "@aws-sdk/client-rds-data";

import * as schema from "./schema";

const client = new RDSDataClient({});

export const db = drizzle(client, {
  schema,
  database: Resource.PostgresDb.database,
  secretArn: Resource.PostgresDb.secretArn,
  resourceArn: Resource.PostgresDb.clusterArn,
});