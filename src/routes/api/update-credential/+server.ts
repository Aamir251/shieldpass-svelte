import { updateCredential } from "$lib/server/db/credentials.js";
import type { credentials } from "$lib/server/db/schema.js";
import { json } from "@sveltejs/kit";

export const POST = async ({ locals, request }) => {
  try {
    const data: {
      id: string;
      credential: typeof credentials.$inferInsert;
    } = await request.json();

    const userId = locals?.user?.id;

    if (!userId) throw new Error("Session Expired");

    await updateCredential(data.id!, data.credential, userId);
    return json({ message: "Success" }, { status: 201 });
  } catch (err: any) {
    console.log({ err });
    return json({ message: err.message }, { status: 404 });
  }
};
