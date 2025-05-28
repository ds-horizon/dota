import { json } from "@remix-run/react";
import { CodepushService } from "~/.server/services/Codepush";
import {
  authenticateActionRequest,
  AuthenticatedActionFunction,
} from "~/utils/authenticate";

const uploadRelease: AuthenticatedActionFunction = async ({
  user,
  request,
  params,
}) => {
  const formData = await request.formData();
  const file = formData.get("file") as File;
  const targetVersions = formData.get("targetVersions") as string;
  const description = formData.get("description") as string;
  const isDisabled = formData.get("isDisabled") === "true";
  const isMandatory = formData.get("isMandatory") === "true";
  const rollout = parseInt(formData.get("rollout") as string);
  const appId = params.app ?? "";
  const deploymentName = params.deploymentName ?? "";

  if (!appId || !deploymentName) {
    return json({ error: "Missing appId or deploymentName" }, { status: 400 });
  }

  const { data, status } = await CodepushService.uploadReleaseForDeployment({
    userId: user.user.id,
    appId,
    deploymentName,
    file,
    targetVersions,
    description,
    isDisabled,
    isMandatory,
    rollout,
  });

  return json(data, { status });
};

export const action = authenticateActionRequest({ POST: uploadRelease }); 