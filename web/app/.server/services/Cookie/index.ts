import { createCookie } from "@remix-run/node"; // or cloudflare/deno

export const redirectTo = createCookie("redirect_to");
