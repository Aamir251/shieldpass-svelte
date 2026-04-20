import { and, eq } from "drizzle-orm";
import { db } from ".";
import { credentials } from "./schema";

export const getCredentialsBasedOnCategory = async (category: string, userId : string) => {
  if (category === "all") {
    return await db.select().from(credentials).where(eq(credentials.userId, userId));
  }
  return await db
    .select()
    .from(credentials)
    .where(eq(credentials.category, category));
};

export const addCredential = async (
  credential: typeof credentials.$inferInsert,
) => {
  return await db.insert(credentials).values(credential);
};

export const getCredentialById = async (id: string) => {
  return await db
    .select()
    .from(credentials)
    .where(eq(credentials.id, id))
    .limit(1);
};

export const updateCredential = async (
  id: string,
  credential: typeof credentials.$inferInsert,
  userId: string,
) => {
  return await db
    .update(credentials)
    .set(credential)
    .where(and(eq(credentials.id, id), eq(credentials.userId, userId)));
};
