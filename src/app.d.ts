// See https://svelte.dev/docs/kit/types#app.d.ts

import type { Session, User } from "better-auth";

// for information about these interfaces
declare global {
  namespace App {
    interface Platform {
      env: Env;
      ctx: ExecutionContext;
      caches: CacheStorage;
      cf?: IncomingRequestCfProperties
    }

    // interface Error {}
    interface Locals {
      user? : User
      session? : Session
    }
    
    // interface PageData {}
    // interface PageState {}
  }

  type EncryptedKey = { data: string; salt: string; iv: string };
}

declare "@auth/core/types" {
  interface Session {
    user: 
      { id: string; role: string

      // ... other custom fields
       } &
      DefaultSession["user"]
    ;
    accessToken: string // For the top-level accessToken field
  }
}

declare "@auth/core/jwt" {
  interface JWT { userId: string; role: string; accessToken: string }
}

export {};
