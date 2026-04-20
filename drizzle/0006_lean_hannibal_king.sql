ALTER TABLE "user" ADD COLUMN "createdAt" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "account" DROP COLUMN "type";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "schoolName";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "sharedPublicKey";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "sharedPrivateKey";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "mainEncryptionKey";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "recoveryEncryptionKey";