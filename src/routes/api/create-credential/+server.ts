import { addCredential } from "$lib/server/db/credentials.js";
import type { credentials } from "$lib/server/db/schema.js";
import { json } from "@sveltejs/kit";

export const POST = async ({ locals, request }) => {
  try {
    const data: typeof credentials.$inferInsert = await request.json();

    const session = await locals.auth();
    if (!session?.user?.id) throw new Error("Session Expired");

    data.userId = session.user.id;
    await addCredential(data);
    return json({ message: "Success" }, { status: 201 });
  } catch (err: any) {
    console.log({ err });
    return json({ message: err.message }, { status: 404 });
  }
};
