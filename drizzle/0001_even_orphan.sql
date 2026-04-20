ALTER TABLE "user" ADD COLUMN "password" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "sharedPublicKey" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "sharedPrivateKey" json;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "encryptionKeyMain" json;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "encryptionKeyRecovery" json;