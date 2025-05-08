import { SocialsProvider } from "./Auth";

export const getAuthenticatorCallbackUrl = (provider: SocialsProvider) => {
  return `/auth/${provider}/callback`;
};
