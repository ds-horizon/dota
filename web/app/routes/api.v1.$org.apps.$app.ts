import { json } from "@remix-run/react";
import { CodepushService } from "~/.server/services/Codepush";
import {
  authenticateActionRequest,
  AuthenticatedActionFunction,
} from "~/utils/authenticate";

const deleteApp: AuthenticatedActionFunction = async ({ user, params }) => {
  const { data, status } = await CodepushService.deleteAppForTenant({
    userId: user.user.id,
    appId: params.app ?? "",
    tenant: params.org ?? "",
  });
  return json(data, { status });
};

export const action = authenticateActionRequest({ DELETE: deleteApp });
