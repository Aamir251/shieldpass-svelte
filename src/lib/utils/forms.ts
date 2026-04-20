import {
  convertCryptoKeyToString,
  encryptMainEncrytionKey,
  encryptSharedPrivateKey,
  generateKeyPair,
  generateMainEncryptionKey,
  storeEncryptionKeyLocally,
} from "./cipher";

export const signUpMiddleware = async (formData: FormData) => {
  const formFields = [
    "name",
    "email",
    "password",
    "confirmPassword",
    "schoolName",
  ] as const;

  validateFormFields(formData, formFields);
  const { name, email, password, schoolName, confirmPassword } =
    extractFormData(formData, formFields);

  if (password !== confirmPassword) throw new Error("Passwords don't match");

  // store this public as a field in User Details
  const { publicKey, privateKey } = await generateKeyPair();
  // the publicKey key is CryptoKey format which needs to converted into string format for storing it in database

  const publicKeyInStringFormat: string =
    await convertCryptoKeyToString(publicKey);

  const sharedPrivateKey = await encryptSharedPrivateKey(privateKey, password);

  /**
   * Create an encryption key for encrypting my credentials and save it
   * This is only created once when the user Signs Up
   */
  const encryptionKey = await generateMainEncryptionKey();

  const encryptionKeyMain = await encryptMainEncrytionKey(
    encryptionKey,
    password,
  );

  // encrypt the main key using the recovery answer (School Name) as well
  const encryptionKeyRecovery = await encryptMainEncrytionKey(
    encryptionKey,
    schoolName,
  );

  await storeEncryptionKeyLocally(encryptionKey);

  formData.delete("confirmPassword");

  formData.set("sharedPublicKey", publicKeyInStringFormat)
  formData.set("sharedPrivateKey", JSON.stringify(sharedPrivateKey))
  formData.set("mainEncryptionKey", JSON.stringify(encryptionKeyMain))
  formData.set("recoveryEncryptionKey", JSON.stringify(encryptionKeyRecovery))

  return {
    name,
    email,
    password,
    schoolName,
    sharedPublicKey: publicKeyInStringFormat,
    sharedPrivateKey: sharedPrivateKey,
    mainEncryptionKey: encryptionKeyMain,
    recoveryEncryptionKey: encryptionKeyRecovery,
  };
};

export const validateFormFields = (
  formData: FormData,
  fieldsToVerify: readonly string[],
) => {
  fieldsToVerify.forEach((field) => {
    const val = formData.get(field);

    if (!val || !val.toString().length) {
      throw new Error(`Please Enter ${field}`);
    }
  });
};

type ExtractFormData<T extends readonly string[]> = {
  [Key in T[number]]: string;
};

export const extractFormData = <T extends readonly string[]>(
  formData: FormData,
  fields: T,
): ExtractFormData<T> => {
  let data = {} as ExtractFormData<T>;

  fields.forEach((field) => {
    const fieldData = formData.get(field) || "";
    data[field as T[number]] = fieldData as string;
  });

  return data;
};
