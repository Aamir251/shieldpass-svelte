import { getEncryptionKey } from "$lib/server/db/utils";
import { ERRORS } from "$lib/utils/constants";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ locals }) => {

  try {
    const userId = locals?.user?.id;

    console.log({ userId })

    if (!userId) throw new Error(ERRORS.SESSION_EXPIRED)

    const userEncryption = await getEncryptionKey(userId);

    if (!userEncryption) throw new Error(ERRORS.ENCRYPTION_KEY_NOT_FOUND)

    const response = {
      encryptionKey: userEncryption.mainEncryptionKey,
    };

    return json(response, { status: 200 });
  } catch (err: any) {
    const errorMessage = err?.message || "Unknown error occurred";

    return json(
      {
        message: errorMessage,
        error: "Failed to retrieve encryption key",
      },
      { status: 500 },
    );
  }
};
