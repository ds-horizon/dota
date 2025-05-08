import axios, { AxiosResponse } from "axios";
import { route } from "routes-gen";
import {
  DeleteDeploymentsRequest,
  DeleteDeploymentsResponse,
} from "~/.server/services/Codepush/types";

type DeleteDeploymentArgs = Omit<DeleteDeploymentsRequest, "userId">;

export const deleteDeployment = async ({
  tenant,
  appId,
  deploymentName,
}: DeleteDeploymentArgs) => {
  const { data } = await axios.delete<
    null,
    AxiosResponse<DeleteDeploymentsResponse>
  >(
    route("/api/v1/:app/deployments", {
      app: appId,
    }),
    {
      headers: { tenant, deploymentName },
    }
  );

  return data;
};
