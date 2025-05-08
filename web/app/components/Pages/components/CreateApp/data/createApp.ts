import axios, { AxiosResponse } from "axios";
import { route } from "routes-gen";
import {
  CreateAppRequest,
  CreateAppResponse,
} from "~/.server/services/Codepush/types";

export type CreateAppArgs = Omit<CreateAppRequest, "userId">;

export const createApp = async ({ name, orgId, orgName }: CreateAppArgs) => {
  const { data } = await axios.post<null, AxiosResponse<CreateAppResponse>>(
    route("/api/v1/:org/apps", {
      org: orgId?.length ? orgId : "new",
    }),
    {
      name,
      orgId,
      orgName,
    }
  );

  return data.app;
};
