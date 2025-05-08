import axios, { AxiosResponse } from "axios";
import { route } from "routes-gen";
import {
  CreateDeploymentsRequest,
  CreateDeploymentsResponse,
} from "~/.server/services/Codepush/types";

export type CreateDeploymentArgs = Omit<CreateDeploymentsRequest, "userId">;

export const createDeployment = async ({
  name,
  appId,
}: CreateDeploymentArgs) => {
  const { data } = await axios.post<
    null,
    AxiosResponse<CreateDeploymentsResponse>
  >(route("/api/v1/:app/deployments", { app: appId }), {
    name,
  });

  return data.deployments;
};
