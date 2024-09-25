import { defineConfig } from "drizzle-kit";
import { Resource } from "sst";

export default defineConfig({
  schema: "./src/drizzle/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    // url: `${process.env.DATABASE_URL}`,
    database: Resource.PostgresDb.database,
    secretArn: Resource.PostgresDb.secretArn,
    resourceArn: Resource.PostgresDb.clusterArn,
  },
});
