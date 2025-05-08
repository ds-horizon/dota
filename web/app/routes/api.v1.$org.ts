import { json } from "@remix-run/react";
import { CodepushService } from "~/.server/services/Codepush";

import {
  authenticateActionRequest,
  AuthenticatedActionFunction,
  authenticateLoaderRequest,
} from "~/utils/authenticate";

export const loader = authenticateLoaderRequest();

const deleteTenant: AuthenticatedActionFunction = async ({ user, params }) => {
  const { data, status } = await CodepushService.deleteTenant({
    userId: user.user.id,
    tenant: params.org ?? "",
  });
  return json(data, { status });
};

export const action = authenticateActionRequest({ DELETE: deleteTenant });
