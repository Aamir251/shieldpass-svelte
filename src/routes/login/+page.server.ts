import { auth } from "$lib/server/auth";
import { APIError } from "better-auth/api";
import { fail, redirect, json } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  if (event?.locals?.user) {
    return redirect(302, "/all");
  }
  return {};
};

export const actions: Actions = {
  default: async (event) => {
    const formData = await event.request.formData();
    const email = formData.get("email")?.toString() ?? "";
    const password = formData.get("password")?.toString() ?? "";

    try {
      await auth.api.signInEmail({
        body: {
          email,
          password,
        },
      });

      return {
        success : "Login Successful"
      }

    } catch (error) {
      console.log({ error });
      if (error instanceof APIError) {
        return fail(400, { message: error.message || "Signin failed" });
      }
      return fail(500, { message: "Unexpected error" });
    }
  },
};
