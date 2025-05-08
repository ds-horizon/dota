import { json } from "@remix-run/react";
import { CodepushService } from "~/.server/services/Codepush";
import {
  authenticateActionRequest,
  AuthenticatedActionFunction,
  authenticateLoaderRequest,
} from "~/utils/authenticate";

const updateRelease: AuthenticatedActionFunction = async ({
  user,
  request,
  params,
}) => {
  const body = await request.json();
  const { data, status } =
    await CodepushService.updateReleaseForDeployentForApp({
      userId: user.user.id,
      appId: params.app ?? "",
      deploymentName: params.deploymentName ?? "",
      appVersion: body.appVersion ?? "",
      description: body.description ?? "",
      isDisabled: body.isDisabled ?? true,
      isMandatory: body.isMandatory ?? false,
      label: body.label ?? "",
      rollout: body.rollout ?? 0,
      tenant: body.tenant ?? "",
    });

  return json(data, { status });
};

export const loader = authenticateLoaderRequest(async ({ user, params }) => {
  const { data, status } = await CodepushService.getReleasesForDeployentsForApp(
    {
      userId: user.user.id,
      appId: params.app ?? "",
      deploymentName: params.deploymentName ?? "",
    }
  );
  return json(data, { status });
});

export const action = authenticateActionRequest({ PATCH: updateRelease });
