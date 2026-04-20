export const CREDENTIAL_CATEGORIES = [
  "All",
  "Finances",
  "Socials",
  "Cloud",
  "Apps",
  "Ecommerce",
] as const;

export const BASE_URL = "/recents";

export const CREDENTIAL_PAGE_CATEGORIES = [
  ...CREDENTIAL_CATEGORIES,
  "shared",
] as const;

export type CredentialCategory = (typeof CREDENTIAL_CATEGORIES)[number];

export type CredentialCategoryPageType =
  (typeof CREDENTIAL_PAGE_CATEGORIES)[number];

export type CredentialSharedWithMe = {
  id: string;
  password: string;
  name: string;
  email: string;
  username: string;
  category: string;
  websiteUrl: string;
  updatedAt: Date;
};

export enum ERRORS {
  SESSION_EXPIRED = "Failed to get session",
  ENCRYPTION_KEY_NOT_FOUND = "Encryption Key Not Found"
}

export enum LOCALSTORAGE_KEYS {
  PRIVATE_KEY = "sp-private-key",
  ENCRYPTION_KEY = "sp-encryption-key",
  USER_EMAIL = "sp-user",
}
