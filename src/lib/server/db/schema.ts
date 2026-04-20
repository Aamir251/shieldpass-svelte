import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  json,
} from "drizzle-orm/pg-core";

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: boolean("emailVerified").default(false),
  image: text("image"),
  password: text("password"),
  schoolName: text("schoolName"),
  sharedPublicKey: text("sharedPublicKey"),
  sharedPrivateKey: json().$type<EncryptedKey>(),
  mainEncryptionKey: json().$type<EncryptedKey>(),
  recoveryEncryptionKey: json().$type<EncryptedKey>(),
  createdAt: timestamp({ mode: "date" }).defaultNow(),
  updatedAt: timestamp({ mode: "date" }).defaultNow()
});

export const accounts = pgTable("account", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  providerId: text("provider").notNull(),
  accountId: text("providerAccountId").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt", { mode: "date" }),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt", { mode: "date" }),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
  // legacy columns kept for existing data
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  session_state: text("session_state"),
});

type CredentialPassword = {
  iv: string;
  data: string;
};

export const credentials = pgTable("credentuals", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  name: text("name").notNull(),
  username: text("username"),
  email: text("email"),
  category: text("category"),
  websiteUrl: text("websiteUrl"),
  password: json().$type<CredentialPassword>().notNull(),

  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const sessions = pgTable("session", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expiresAt", { mode: "date" }).notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
});

// export const verificationTokens = pgTable(
//   "verificationToken",
//   {
//     identifier: text("identifier").notNull(),
//     token: text("token").notNull(),
//     expires: timestamp("expires", { mode: "date" }).notNull(),
//   },
//   (verificationToken) => [
//     {
//       compositePk: primaryKey({
//         columns: [verificationToken.identifier, verificationToken.token],
//       }),
//     },
//   ],
// );

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => [
    {
      compositePK: primaryKey({
        columns: [authenticator.userId, authenticator.credentialID],
      }),
    },
  ],
);
