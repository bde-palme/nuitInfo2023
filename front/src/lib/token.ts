import { browser } from "$app/environment";
import { writable } from "svelte/store";

let store = writable(
    browser && localStorage.getItem("credentials") != null
        ? (JSON.parse(localStorage.getItem("credentials")!) as {
              team: string;
              token: string;
          })
        : null
);
export const credentials = browser
    ? {
          subscribe: store.subscribe,
          set: (cred: {team: string, token: string}) => {
              store.set(cred);
          },
      }
    : null;
