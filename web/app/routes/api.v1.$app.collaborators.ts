import { json } from "@remix-run/react";
import { CodepushService } from "~/.server/services/Codepush";
import {
  authenticateActionRequest,
  AuthenticatedActionFunction,
  authenticateLoaderRequest,
} from "~/utils/authenticate";

const addCollabarator: AuthenticatedActionFunction = async ({
  user,
  params,
  request,
}) => {
  const body = await request.json();
  const { data, status } = await CodepushService.addCollaboratorForApp({
    userId: user.user.id,
    appId: params.app ?? "",
    email: body.email ?? "",
    tenant: body.tenant ?? "",
  });
  return json(data, { status });
};

const removeCollabarator: AuthenticatedActionFunction = async ({
  user,
  params,
  request,
}) => {
  const { data, status } = await CodepushService.removeCollaboratorForApp({
    userId: user.user.id,
    appId: params.app ?? "",
    email: request.headers.get("email") ?? "",
    tenant: request.headers.get("tenant") ?? "",
  });
  return json(data, { status });
};

const updateCollabarator: AuthenticatedActionFunction = async ({
  user,
  params,
  request,
}) => {
  const body = await request.json();
  const { data, status } =
    await CodepushService.updateCollaboratorPermissionForApp({
      userId: user.user.id,
      appId: params.app ?? "",
      email: body.email ?? "",
      tenant: body.tenant ?? "",
      role: body.role ?? "Collaborator",
    });
  return json(data, { status });
};

export const loader = authenticateLoaderRequest(
  async ({ user, params, request }) => {
    const { data, status } = await CodepushService.getCollaboratorForApp({
      userId: user.user.id,
      appId: params.app ?? "",
      tenant: request.headers.get("tenant") ?? "",
    });
    return json(data, { status });
  }
);

export const action = authenticateActionRequest({
  POST: addCollabarator,
  PATCH: updateCollabarator,
  DELETE: removeCollabarator,
});
