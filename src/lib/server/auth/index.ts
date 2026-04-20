import { betterAuth } from "better-auth/minimal";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { sveltekitCookies } from "better-auth/svelte-kit";
import { env } from "$env/dynamic/private";
import { getRequestEvent } from "$app/server";
import { db } from "$lib/server/db";
import { users, accounts, sessions } from "$lib/server/db/schema";

export const auth = betterAuth({
  baseURL: env.ORIGIN,
  secret: env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: users,
      account: accounts,
      session: sessions,
    },
  }),
  advanced : {
    database : {
      generateId : false
    },
  },
  user : {
    additionalFields : {
      schoolName : {
        type : "string",
        required : true,
      },
      recoveryEncryptionKey : {
        type : "json",
        required : true
      },
      mainEncryptionKey : {
        type : "json",
        required : true
      },
      sharedPrivateKey : {
        type : "json",
        required : true
      },
      sharedPublicKey : {
        type : "string",
        required : true
      }
    }
  },
  emailAndPassword: { enabled: true },
  plugins: [
    sveltekitCookies(getRequestEvent), // make sure this is the last plugin in the array
  ],
});


// recoveryEncryptionKey
// mainEncryptionKey
// sharedPrivateKey
// sharedPublicKey