import { json } from "@remix-run/react";
import { CodepushService } from "~/.server/services/Codepush";
import {
  authenticateActionRequest,
  AuthenticatedActionFunction,
  authenticateLoaderRequest,
} from "~/utils/authenticate";

const createDeployment: AuthenticatedActionFunction = async ({
  user,
  params,
  request,
}) => {
  const body = await request.json();
  const { data, status } = await CodepushService.createDeployentsForApp({
    userId: user.user.id,
    appId: params.app ?? "",
    name: body.name ?? "",
  });
  return json(data, { status });
};

const deleteDeployment: AuthenticatedActionFunction = async ({
  user,
  params,
  request,
}) => {
  const { data, status } = await CodepushService.deleteDeployentsForApp({
    userId: user.user.id,
    appId: params.app ?? "",
    tenant: request.headers.get("tenant") ?? "",
    deploymentName: request.headers.get("deploymentName") ?? "",
  });
  return json(data, { status });
};

export const loader = authenticateLoaderRequest(async ({ user, params }) => {
  const { data, status } = await CodepushService.getDeployentsForApp({
    userId: user.user.id,
    appId: params.app ?? "",
  });
  return json(data, { status });
});

export const action = authenticateActionRequest({
  POST: createDeployment,
  DELETE: deleteDeployment,
});
