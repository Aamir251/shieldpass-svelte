import { fail } from "@sveltejs/kit";
import bcrypt from "bcryptjs";
import { APIError } from "better-auth";
import { auth } from "$lib/server/auth";
import type { Actions, RequestEvent } from "./$types";

export const actions : Actions = {
  default : async (event : RequestEvent) => {
   try {
    
    const formData = await event.request.formData()

    const SALT_ROUNDS = 10;

    const schoolName = formData.get("schoolName") as string;

    const hashedSchoolName = bcrypt.hashSync(schoolName, SALT_ROUNDS);

    formData.set("schoolName", hashedSchoolName);

    let user : any = {};

    formData.entries().forEach(item => {
      const value = item[1].toString();
      user[item[0]] = value.includes("{") ? JSON.parse(value) : value
    })
    
    const resp = await auth.api.signUpEmail({
      body : user
    })

    console.log({ resp })
   } catch(error) {

    console.log({ error })
  	if (error instanceof APIError) {
			return fail(400, { message: error.message || 'SignUp failed' });
		}
		return fail(500, { message: 'Unexpected error' });
   }
  }
}
