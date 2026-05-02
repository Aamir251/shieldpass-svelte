import { getSearchCredentials } from "$lib/server/db/credentials";
import { redirect } from "@sveltejs/kit";

export const load = ({ url, locals }) => {
  const query = url.searchParams.get("q");

  if (!locals.user?.id) {
    return redirect(302, "/login");
  }

  if (!query) {
    redirect(302, "/all");
  }

  console.log(query, locals.user.id);
  return {
    getSearchCredentials: getSearchCredentials(query, locals.user.id),
  };
};
