import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  varchar,
  integer,
  index,
  uniqueIndex,
  foreignKey,
  pgEnum,
} from "drizzle-orm/pg-core";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import type { AdapterAccount } from "next-auth/adapters";
import { sql } from "drizzle-orm";
export * as drizzle from "./schema";

const connectionString = process.env.DATABASE_URL!;

const client = postgres(connectionString!);
const pool = postgres(connectionString, { max: 1 });

export const db = drizzle(pool);
export const role = pgEnum("Role", ["owner", "member"]);
export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  })
);

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  })
);

export const project = pgTable(
  "Project",
  {
    id: text("id").primaryKey().notNull(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    logo: text("logo"),
    plan: text("plan").default("free").notNull(),
    stripeId: text("stripeId"),
    billingCycleStart: integer("billingCycleStart").notNull(),
    stripeConnectId: text("stripeConnectId"),
    inviteCode: text("inviteCode"),
    createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt", {
      precision: 3,
      mode: "string",
    }).notNull(),
    usageLastChecked: timestamp("usageLastChecked", {
      precision: 3,
      mode: "string",
    })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => {
    return {
      inviteCodeKey: uniqueIndex("Project_inviteCode_key").using(
        "btree",
        table.inviteCode.asc().nullsLast()
      ),
      slugKey: uniqueIndex("Project_slug_key").using(
        "btree",
        table.slug.asc().nullsLast()
      ),
      stripeConnectIdKey: uniqueIndex("Project_stripeConnectId_key").using(
        "btree",
        table.stripeConnectId.asc().nullsLast()
      ),
      stripeIdKey: uniqueIndex("Project_stripeId_key").using(
        "btree",
        table.stripeId.asc().nullsLast()
      ),
      usageLastCheckedIdx: index("Project_usageLastChecked_idx").using(
        "btree",
        table.usageLastChecked.asc().nullsLast()
      ),
    };
  }
);

export const projectUsers = pgTable(
  "ProjectUsers",
  {
    id: text("id").primaryKey().notNull(),
    role: role("role").default("member").notNull(),
    createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt", {
      precision: 3,
      mode: "string",
    }).notNull(),
    userId: text("userId").notNull(),
    projectId: text("projectId").notNull(),
  },
  (table) => {
    return {
      projectIdIdx: index("ProjectUsers_projectId_idx").using(
        "btree",
        table.projectId.asc().nullsLast()
      ),
      userIdProjectIdKey: uniqueIndex(
        "ProjectUsers_userId_projectId_key"
      ).using(
        "btree",
        table.userId.asc().nullsLast(),
        table.projectId.asc().nullsLast()
      ),
      projectUsersProjectIdFkey: foreignKey({
        columns: [table.projectId],
        foreignColumns: [project.id],
        name: "ProjectUsers_projectId_fkey",
      })
        .onUpdate("cascade")
        .onDelete("cascade"),
      projectUsersUserIdFkey: foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
        name: "ProjectUsers_userId_fkey",
      })
        .onUpdate("cascade")
        .onDelete("cascade"),
    };
  }
);

export const projectInvite = pgTable(
  "ProjectInvite",
  {
    email: text("email").notNull(),
    expires: timestamp("expires", { precision: 3, mode: "string" }).notNull(),
    projectId: text("projectId").notNull(),
    createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => {
    return {
      emailProjectIdKey: uniqueIndex("ProjectInvite_email_projectId_key").using(
        "btree",
        table.email.asc().nullsLast(),
        table.projectId.asc().nullsLast()
      ),
      projectIdIdx: index("ProjectInvite_projectId_idx").using(
        "btree",
        table.projectId.asc().nullsLast()
      ),
      projectInviteProjectIdFkey: foreignKey({
        columns: [table.projectId],
        foreignColumns: [project.id],
        name: "ProjectInvite_projectId_fkey",
      })
        .onUpdate("cascade")
        .onDelete("cascade"),
    };
  }
);
