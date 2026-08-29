import { auth } from "$lib/auth";
import { svelteKitHandler } from "better-auth/svelte-kit";
import { building } from "$app/environment";
import type { Handle } from '@sveltejs/kit';
import { redirect } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  const session = await auth.api.getSession({
    headers: event.request.headers,
  });

  console.log(session)

  if (session) {
    event.locals.session = session.session;
    event.locals.user = session.user;
  }

  const isAuthPage = event.url.pathname === '/login' || event.url.pathname === '/signup' || event.url.pathname === '/';

  if (session && isAuthPage) {
    throw redirect(303, '/dashboard');
  }

  if (!session && event.url.pathname.startsWith('/dashboard')) {
    throw redirect(303, '/login');
  }

  const pb_cookie = event.cookies.get("pb_auth") || null
  if (pb_cookie) {
    event.locals.token = "pb_auth=" + encodeURIComponent(pb_cookie)
  }
  return svelteKitHandler({ event, resolve, auth, building });
}