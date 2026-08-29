import { betterAuth } from "better-auth";
import { pocketBaseAdapter } from "pocketbase-better-auth";
import { sveltekitCookies } from "better-auth/svelte-kit";
import { getRequestEvent } from "$app/server";
import Pocketbase from "pocketbase"
import { POCKETBASE_ADMIN_EMAIL, POCKETBASE_ADMIN_PASSWORD } from "$env/static/private"
import { createAuthMiddleware } from "better-auth/api";


const client = new Pocketbase("http://192.168.0.102:8090")
await client.collection("_superusers").authWithPassword(POCKETBASE_ADMIN_EMAIL, POCKETBASE_ADMIN_PASSWORD);

export const auth = betterAuth({
  database: pocketBaseAdapter({
    pb: client,
    usePlural: false
  }),
  emailAndPassword: { enabled: true },
  plugins: [sveltekitCookies(getRequestEvent)],
  hooks: {
    after: createAuthMiddleware(async ({ context, path, setCookie,  }) => {
      const session = context.newSession
      if (path.startsWith("/sign-up") && session) {
        const password = crypto.randomUUID()
        
        const record = await client.collection("pb_user").create({
          email: session.user.email,
          password: password,
          passwordConfirm: password,
          id: session.user.id
        })

        const { authStore } = await client.collection("pb_user").impersonate(record.id, 604800)   
        const cookiePayload = JSON.stringify({
          token: authStore.token,
          record: authStore.record
        });
        
        setCookie("pb_auth", cookiePayload, {
          path: "/",
          httpOnly: false,
          secure: false,
          sameSite: "lax",
          maxAge: 604800
        })
      } else if (path.startsWith("/sign-in") && session) {
        
        const { authStore } = await client.collection("pb_user").impersonate(session.user.id, 604800)
        const cookiePayload = JSON.stringify({
          token: authStore.token,
          record: authStore.record
        });
        
        setCookie("pb_auth", cookiePayload, {
          path: "/",
          httpOnly: false,
          secure: false,
          sameSite: "lax",
          maxAge: 604800
        })
      } else if (path.startsWith("/sign-out")) {
        setCookie("pb_auth", "", { maxAge: 0 })
      }
    })
  }
});