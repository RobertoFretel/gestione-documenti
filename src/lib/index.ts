import { createAuthClient } from "better-auth/svelte";
import { getContext, setContext } from "svelte";
import PocketBase from "pocketbase"

import type { SvelteAuthClient } from "better-auth/svelte";
import type { TypedPocketBase } from "./pocketbase-types"
import type { BetterAuthClientOptions } from "better-auth/client";

const getClientPbUrl = () => {
  if (typeof window !== "undefined") {
    return `${window.location.protocol}//${window.location.hostname}:8090`;
  }
  return "http://192.168.0.102:8090";
};


const AUTH_KEY = Symbol("AUTH_KEY")
export const pb = new PocketBase(getClientPbUrl()) as TypedPocketBase;

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

