import { Resource } from "sst";
import { type Config } from "drizzle-kit";

export default {
  driver: "aws-data-api",
  schema: "./src/drizzle/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    database: Resource.PostgresDb.database,
    secretArn: Resource.PostgresDb.secretArn,
    resourceArn: Resource.PostgresDb.clusterArn,
  },
  tablesFilter: ["aws-t3_*"],
} satisfies Config;
