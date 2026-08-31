import { createAuthClient } from "better-auth/svelte";
import { getContext, setContext } from "svelte";
import PocketBase from "pocketbase"

import type { SvelteAuthClient } from "better-auth/svelte";
import type { TypedPocketBase } from "./pocketbase-types"
import type { BetterAuthClientOptions } from "better-auth/client";

import { dev } from "$app/environment";

const AUTH_KEY = Symbol("AUTH_KEY")
export const pb = new PocketBase(dev ? 'http://192.168.0.102:8090' : 'http://roberto-fretel-v3.taile9b1b0.ts.net:8090') as TypedPocketBase;

type SuccessfullAuth = { isValidPocket: true, betterAuth<Option extends BetterAuthClientOptions>(options?: Option | undefined): SvelteAuthClient<Option> }
type FailedAuth = { isValidPocket: false }

export function useCompleteAuth (token: () => string): SuccessfullAuth | FailedAuth {
  const betterAuth = createAuthClient
  if (token) {
    pb.authStore.loadFromCookie(token(), 'pb_auth');
    if (!pb.authStore.isValid) {
      const state = { isValidPocket: false } as const;
    
      setContext(AUTH_KEY, state);
      return state;
    }

    const state = { betterAuth, isValidPocket: true as const };
    
    setContext(AUTH_KEY, state);
    return state;
  } else {
    const state = { isValidPocket: false } as const;

    setContext(AUTH_KEY, state);
    return state;
  }
}

 export function getCompleteAuth () {
  return getContext<SuccessfullAuth | FailedAuth>(AUTH_KEY)
}

