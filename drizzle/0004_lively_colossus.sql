CREATE TABLE "credentuals" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"username" text,
	"email" text,
	"category" text,
	"websiteUrl" text,
	"password" text NOT NULL,
	"userId" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "credentuals" ADD CONSTRAINT "credentuals_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;