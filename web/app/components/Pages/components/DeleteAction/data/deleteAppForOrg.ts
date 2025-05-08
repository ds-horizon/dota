import axios, { AxiosResponse } from "axios";
import { route } from "routes-gen";
import {
  DeleteAppRequest,
  DeleteAppResponse,
} from "~/.server/services/Codepush/types";

export type DeleteAppOrgs = Omit<DeleteAppRequest, "userId">;

export const deleteAppForOrg = async ({ tenant, appId }: DeleteAppOrgs) => {
  const { data } = await axios.delete<null, AxiosResponse<DeleteAppResponse>>(
    route("/api/v1/:org/apps/:app", {
      org: tenant,
      app: appId,
    })
  );

  return data;
};
