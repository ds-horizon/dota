import axios, { AxiosResponse } from "axios";
import { route } from "routes-gen";
import {
  AppsRequest,
  DeleteAppResponse,
} from "~/.server/services/Codepush/types";

export type DeleteOrg = Omit<AppsRequest, "userId">;

export const deleteOrg = async ({ tenant }: DeleteOrg) => {
  const { data } = await axios.delete<null, AxiosResponse<DeleteAppResponse>>(
    route("/api/v1/:org", {
      org: tenant,
    })
  );

  return data;
};
