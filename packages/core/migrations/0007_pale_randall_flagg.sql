CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" text,
	"phone" varchar(256)
);
--> statement-breakpoint
DROP TABLE "Account";--> statement-breakpoint
DROP TABLE "Customer";--> statement-breakpoint
DROP TABLE "Equipments";--> statement-breakpoint
DROP TABLE "Farmers";--> statement-breakpoint
DROP TABLE "Harvests";--> statement-breakpoint
DROP TABLE "Inventory";--> statement-breakpoint
DROP TABLE "Project";--> statement-breakpoint
DROP TABLE "ProjectInvite";--> statement-breakpoint
DROP TABLE "ProjectUsers";--> statement-breakpoint
DROP TABLE "ReportTrackingEvents";--> statement-breakpoint
DROP TABLE "Reports";--> statement-breakpoint
DROP TABLE "SentEmail";--> statement-breakpoint
DROP TABLE "Session";--> statement-breakpoint
DROP TABLE "User";--> statement-breakpoint
DROP TABLE "VerificationToken";--> statement-breakpoint
DROP TABLE "Warehouses";