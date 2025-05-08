import { json } from "@remix-run/node";

import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  AuthenticatorService,
  SocialsProvider,
} from "~/.server/services/Auth/Auth";

export const loader = async (args: LoaderFunctionArgs) => {
  return json(await AuthenticatorService.getUser(args.request));
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  return AuthenticatorService.authenticate(
    params.provider as SocialsProvider,
    request
  );
};
