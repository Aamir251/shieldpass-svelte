ALTER TABLE "account" ADD COLUMN "provider" text NOT NULL;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "providerAccountId" text NOT NULL;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "refresh_token" text;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "access_token" text;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "expires_at" integer;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "token_type" text;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "id_token" text;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "session_state" text;--> statement-breakpoint
ALTER TABLE "account" DROP COLUMN "id";--> statement-breakpoint
ALTER TABLE "account" DROP COLUMN "accountId";--> statement-breakpoint
ALTER TABLE "account" DROP COLUMN "providerId";--> statement-breakpoint
ALTER TABLE "account" DROP COLUMN "accessToken";--> statement-breakpoint
ALTER TABLE "account" DROP COLUMN "refreshToken";--> statement-breakpoint
ALTER TABLE "account" DROP COLUMN "idToken";--> statement-breakpoint
ALTER TABLE "account" DROP COLUMN "accessTokenExpiresAt";--> statement-breakpoint
ALTER TABLE "account" DROP COLUMN "refreshTokenExpiresAt";--> statement-breakpoint
ALTER TABLE "account" DROP COLUMN "password";--> statement-breakpoint
ALTER TABLE "account" DROP COLUMN "createdAt";--> statement-breakpoint
ALTER TABLE "account" DROP COLUMN "updatedAt";