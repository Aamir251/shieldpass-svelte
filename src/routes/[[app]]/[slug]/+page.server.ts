import { getCredentialsBasedOnCategory } from "$lib/server/db/credentials";
import {
  CREDENTIAL_CATEGORIES,
  CREDENTIAL_PAGE_CATEGORIES,
} from "$lib/utils/constants.js";
import { error, redirect } from "@sveltejs/kit";

type CredentialPageCategory = (typeof CREDENTIAL_PAGE_CATEGORIES)[number];

export const load = async ({ params, locals }) => {

  if (!locals.user?.id) {
    return redirect(302, "/login");

  }
  const { slug } = params;

  function isCredentialPageCategory(
    slug: string,
  ): slug is CredentialPageCategory {
    return [...CREDENTIAL_PAGE_CATEGORIES]
      .map((el) => el.toLocaleLowerCase())
      .includes(slug as CredentialPageCategory);
  }

  // if (!isCredentialPageCategory(slug)) {
  //   error(404, "Page Not found");
  // }

  // fetch credentials based on category

  const resp = await getCredentialsBasedOnCategory(slug, locals.user.id);

  return {
    credentials: resp,
  };
};
