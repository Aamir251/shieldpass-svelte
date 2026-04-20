import { users } from "$lib/server/db/schema.js";
import { eq } from "drizzle-orm";
import { db } from ".";

const userDtoMapper = (user: typeof users.$inferSelect) => {
  return {
    id: user.id,
    username: user.name,
    email: user.email,
  };
};

export const getUserByEmail = async (email: string) => {
  const [user] = await db
    .selectDistinct({
      id: users.id,
      email: users.email,
      password: users.password,
    })
    .from(users)
    .where(eq(users.email, email));

  return user ?? null;
};

export const getEncryptionKey = async (id: string) => {
  const [user] = await db
    .select({
      mainEncryptionKey: users.mainEncryptionKey,
    })
    .from(users)
    .where(eq(users.id, id));

  return user ?? null;
};
