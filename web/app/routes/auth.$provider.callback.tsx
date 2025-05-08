import { type LoaderFunctionArgs } from "@remix-run/node";

import {
  AuthenticatorService,
  SocialsProvider,
} from "~/.server/services/Auth/Auth";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  return await AuthenticatorService.callback(
    params.provider as SocialsProvider,
    request
  );
};
