import { json } from "@remix-run/react";
import { CodepushService } from "~/.server/services/Codepush";
import {
  authenticateActionRequest,
  AuthenticatedActionFunction,
} from "~/utils/authenticate";

const promoteRelease: AuthenticatedActionFunction = async ({
  user,
  request,
  params,
}) => {
  const body = await request.json();
  const { data, status } = await CodepushService.promoteReleaseFromDeployment({
    userId: user.user.id,
    appId: params.app ?? "",
    appVersion: body.appVersion ?? "",
    description: body.description ?? "",
    isDisabled: body.isDisabled ?? true,
    isMandatory: body.isDisabled ?? false,
    sourceDeployment: params.deploymentName ?? "",
    targetDeployment: params.targetDeployment ?? "",
    label: body.label ?? "",
    tenant: body.tenant ?? "",
  });

  return json(data, { status });
};

export const action = authenticateActionRequest({ POST: promoteRelease });
