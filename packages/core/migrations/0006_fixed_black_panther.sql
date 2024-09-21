DO $$ BEGIN
 CREATE TYPE "public"."Role" AS ENUM('owner', 'member');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Account" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	CONSTRAINT "Account_pkey" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Customer" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"avatar" text,
	"externalId" text,
	"projectId" text NOT NULL,
	"projectConnectId" text,
	"stripeCustomerId" text,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Equipments" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" text,
	"leased" boolean NOT NULL,
	"dateAcquired" timestamp(3) NOT NULL,
	"purchasePrice" text NOT NULL,
	"estimatedValue" text,
	"brand" text,
	"status" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Farmers" (
	"id" text PRIMARY KEY NOT NULL,
	"fullName" text NOT NULL,
	"phoneNumber" text,
	"farmSize" integer NOT NULL,
	"province" text NOT NULL,
	"country" text NOT NULL,
	"crops" text NOT NULL,
	"quantityCanSupply" integer NOT NULL,
	"project_id" text NOT NULL,
	"userId" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Harvests" (
	"id" text PRIMARY KEY NOT NULL,
	"date" timestamp(3) NOT NULL,
	"name" text NOT NULL,
	"crop" text NOT NULL,
	"size" integer NOT NULL,
	"inputsUsed" text NOT NULL,
	"unit" text NOT NULL,
	"farmersId" text NOT NULL,
	"project_id" text NOT NULL,
	"userId" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Inventory" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"inventoryType" text NOT NULL,
	"inventoryUnit" text NOT NULL,
	"description" text,
	"estimatedValuePerUnit" text NOT NULL,
	"warehousesId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Project" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"logo" text,
	"plan" text DEFAULT 'free' NOT NULL,
	"stripeId" text,
	"billingCycleStart" integer NOT NULL,
	"stripeConnectId" text,
	"inviteCode" text,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"usageLastChecked" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"farmersLimit" integer DEFAULT 10 NOT NULL,
	"harvestsLimit" integer DEFAULT 5 NOT NULL,
	"reportLimit" integer DEFAULT 5 NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ProjectInvite" (
	"email" text NOT NULL,
	"expires" timestamp(3) NOT NULL,
	"projectId" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ProjectUsers" (
	"id" text PRIMARY KEY NOT NULL,
	"role" "Role" DEFAULT 'member' NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"userId" text NOT NULL,
	"projectId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ReportTrackingEvents" (
	"id" text PRIMARY KEY NOT NULL,
	"eventName" text NOT NULL,
	"dateCreated" timestamp(3) NOT NULL,
	"description" text NOT NULL,
	"reportId" text NOT NULL,
	"project_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Reports" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"dateCreated" timestamp(3) NOT NULL,
	"finishedTracking" boolean DEFAULT false NOT NULL,
	"harvestsId" text NOT NULL,
	"project_id" text NOT NULL,
	"userId" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "SentEmail" (
	"id" text PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"projectId" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Session" (
	"sessionToken" text NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp(3) NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "User" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"emailVerified" timestamp(3),
	"image" text,
	"source" text,
	"defaultWorkspace" text,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "VerificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp(3) NOT NULL,
	CONSTRAINT "VerificationToken_pkey" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Warehouses" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"maxCapacity" integer NOT NULL,
	"unit" text NOT NULL,
	"project_id" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Customer" ADD CONSTRAINT "Customer_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Farmers" ADD CONSTRAINT "Farmers_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."Project"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Farmers" ADD CONSTRAINT "Farmers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Harvests" ADD CONSTRAINT "Harvests_farmersId_fkey" FOREIGN KEY ("farmersId") REFERENCES "public"."Farmers"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Harvests" ADD CONSTRAINT "Harvests_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."Project"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Harvests" ADD CONSTRAINT "Harvests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_warehousesId_fkey" FOREIGN KEY ("warehousesId") REFERENCES "public"."Warehouses"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ProjectInvite" ADD CONSTRAINT "ProjectInvite_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ProjectUsers" ADD CONSTRAINT "ProjectUsers_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ProjectUsers" ADD CONSTRAINT "ProjectUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ReportTrackingEvents" ADD CONSTRAINT "ReportTrackingEvents_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."Project"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ReportTrackingEvents" ADD CONSTRAINT "ReportTrackingEvents_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "public"."Reports"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Reports" ADD CONSTRAINT "Reports_harvestsId_fkey" FOREIGN KEY ("harvestsId") REFERENCES "public"."Harvests"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Reports" ADD CONSTRAINT "Reports_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."Project"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Reports" ADD CONSTRAINT "Reports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "SentEmail" ADD CONSTRAINT "SentEmail_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Warehouses" ADD CONSTRAINT "Warehouses_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."Project"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Customer_externalId_idx" ON "Customer" USING btree ("externalId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Customer_projectConnectId_externalId_key" ON "Customer" USING btree ("projectConnectId","externalId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Customer_projectConnectId_idx" ON "Customer" USING btree ("projectConnectId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Customer_projectId_externalId_key" ON "Customer" USING btree ("projectId","externalId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Customer_projectId_idx" ON "Customer" USING btree ("projectId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Customer_stripeCustomerId_key" ON "Customer" USING btree ("stripeCustomerId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Farmers_project_id_idx" ON "Farmers" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Farmers_userId_idx" ON "Farmers" USING btree ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Harvests_project_id_idx" ON "Harvests" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Harvests_userId_idx" ON "Harvests" USING btree ("userId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Project_inviteCode_key" ON "Project" USING btree ("inviteCode");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Project_slug_key" ON "Project" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Project_stripeConnectId_key" ON "Project" USING btree ("stripeConnectId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Project_stripeId_key" ON "Project" USING btree ("stripeId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Project_usageLastChecked_idx" ON "Project" USING btree ("usageLastChecked");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "ProjectInvite_email_projectId_key" ON "ProjectInvite" USING btree ("email","projectId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ProjectInvite_projectId_idx" ON "ProjectInvite" USING btree ("projectId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ProjectUsers_projectId_idx" ON "ProjectUsers" USING btree ("projectId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "ProjectUsers_userId_projectId_key" ON "ProjectUsers" USING btree ("userId","projectId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ReportTrackingEvents_project_id_idx" ON "ReportTrackingEvents" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Reports_project_id_idx" ON "Reports" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Reports_userId_idx" ON "Reports" USING btree ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "SentEmail_projectId_idx" ON "SentEmail" USING btree ("projectId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Session_sessionToken_key" ON "Session" USING btree ("sessionToken");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "User_defaultWorkspace_idx" ON "User" USING btree ("defaultWorkspace");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "User_source_idx" ON "User" USING btree ("source");