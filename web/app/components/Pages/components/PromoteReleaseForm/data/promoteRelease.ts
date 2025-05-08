import axios, { AxiosResponse } from "axios";
import { route } from "routes-gen";
import {
  PromoteReleaseToDeploymentRequest,
  PromoteReleaseToDeploymentResponse,
} from "~/.server/services/Codepush/types";

export type PromoteReleaseArgs = Omit<
  PromoteReleaseToDeploymentRequest,
  "userId"
>;
export const promoteRelease = async (body: PromoteReleaseArgs) => {
  const { data } = await axios.post<
    null,
    AxiosResponse<PromoteReleaseToDeploymentResponse>
  >(
    route(
      "/api/v1/:app/deployments/:deploymentName/promote/:targetDeployment",
      {
        app: body.appId,
        deploymentName: body.sourceDeployment,
        targetDeployment: body.targetDeployment,
      }
    ),
    body
  );

  return data;
};
