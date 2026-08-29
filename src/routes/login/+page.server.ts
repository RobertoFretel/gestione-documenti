import type { Actions } from '@sveltejs/kit';

import { auth } from '$lib/auth';
import { fail } from '@sveltejs/kit';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.email({ message: "Email non valida" }),
  password: z.string().min(8, { message: "La password deve avere almeno 8 caratteri" }),
});

export const actions: Actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    
    const email = formData.get('email');
    const password = formData.get('password');

    const result = loginSchema.safeParse({ email, password });
    console.log(result)

    if (!result.success) {
      const errors = z.treeifyError(result.error);
      
      return fail(400, {
        type: "zod_error",
        errors: errors.properties
      });
    }

    try {
      await auth.api.signInEmail({
        body: {
          email: result.data.email,
          password: result.data.password,
        },
        headers: request.headers
      })
    } catch (error) {
      
      return fail(401, {
        type: "pocketbase_error",
        errors: "Invalid email or password",
      });
    }
    return { success: true };
  }
};