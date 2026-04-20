import type { credentials } from "$lib/server/db/schema";

export { default as PasswordDrawer } from "./credential.svelte";

export type Credential = typeof credentials.$inferSelect;
