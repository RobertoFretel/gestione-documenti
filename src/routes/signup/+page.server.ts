import type { Actions } from '@sveltejs/kit';

import { auth } from '$lib/auth';
import { fail } from '@sveltejs/kit';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.email({ message: "Email non valida" }),
  password: z.string().min(8, { message: "La password deve avere almeno 8 caratteri" }),
  username: z.string().max(20)
});

export const actions: Actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    
    const email = formData.get('email');
    const password = formData.get('password');
    const username = formData.get('username')

    const result = loginSchema.safeParse({ email, password, username });

    if (!result.success) {
      const errors = z.treeifyError(result.error);

      return fail(400, {
        type: "zod_error",
        errors: errors.properties
      });
    }

    try {
      await auth.api.signUpEmail({
        body: {
          email: result.data.email,
          password: result.data.password,
          name: result.data.username,
        },
        headers: request.headers
      })
    } catch (error) {
      
      return fail(409, {
        type: "pocketbase_error",
        errors: "Invalid email or password",
      });
    }
    return { success: true };
  }
};