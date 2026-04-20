ALTER TABLE "account" RENAME COLUMN "provider" TO "accountId";--> statement-breakpoint
ALTER TABLE "account" RENAME COLUMN "providerAccountId" TO "providerId";--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "id" text PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "accessToken" text;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "refreshToken" text;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "idToken" text;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "accessTokenExpiresAt" timestamp;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "refreshTokenExpiresAt" timestamp;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "password" text;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "createdAt" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "updatedAt" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "account" DROP COLUMN "refresh_token";--> statement-breakpoint
ALTER TABLE "account" DROP COLUMN "access_token";--> statement-breakpoint
ALTER TABLE "account" DROP COLUMN "expires_at";--> statement-breakpoint
ALTER TABLE "account" DROP COLUMN "token_type";--> statement-breakpoint
ALTER TABLE "account" DROP COLUMN "id_token";--> statement-breakpoint
ALTER TABLE "account" DROP COLUMN "session_state";