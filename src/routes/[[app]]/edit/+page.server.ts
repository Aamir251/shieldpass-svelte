import { getCredentialById } from "$lib/server/db/credentials.js";
import { error, json, redirect } from "@sveltejs/kit";

export const load = async (req) => {
  const id = req.url.searchParams.get("credential");

  if (!id) {
    redirect(307, "/all")
  };

  const data = await getCredentialById(id);
  console.log({ data })

  if (!data.length) {
    console.log('Credential not found')
    error(404, {
      message : "Credential Not Found"
    })
  }

  return {
    credential: data[0],
  };

};
