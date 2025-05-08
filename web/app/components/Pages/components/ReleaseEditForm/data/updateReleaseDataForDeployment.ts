import axios, { AxiosResponse } from "axios";
import { route } from "routes-gen";
import {
  UpdateDeploymentsReleaseRequest,
  UpdateDeploymentsReleaseResponse,
} from "~/.server/services/Codepush/types";

export type UpdateReleaseDataForDeploymentArgs = Omit<
  UpdateDeploymentsReleaseRequest,
  "userId"
>;

export const updateReleaseDataForDeployment = async (
  data: UpdateReleaseDataForDeploymentArgs
) => {
  return await axios.patch<
    null,
    AxiosResponse<UpdateDeploymentsReleaseResponse>
  >(
    route("/api/v1/:app/deployments/:deploymentName", {
      app: data.appId,
      deploymentName: data.deploymentName,
    }),
    data
  );
};
