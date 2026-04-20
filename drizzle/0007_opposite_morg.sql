ALTER TABLE "user" ADD COLUMN "schoolName" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "sharedPublicKey" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "sharedPrivateKey" json;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "mainEncryptionKey" json;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "recoveryEncryptionKey" json;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "updatedAt" timestamp DEFAULT now();