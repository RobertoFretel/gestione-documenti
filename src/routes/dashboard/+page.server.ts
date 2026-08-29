import type { Actions } from '@sveltejs/kit';

import { auth } from '$lib/auth';
import { fail } from '@sveltejs/kit';

export const actions: Actions = {
  default: async ({ request }) => {
    try {
      await auth.api.signOut({
        headers: request.headers
      })
    } catch (error) {
      return fail(409, { error: "Logout fallita" });
    }
    return { success: true };
  }
};