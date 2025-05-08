import axios, { AxiosResponse } from "axios";
import { route } from "routes-gen";
import {
  UpdateCollabaratorsRequest,
  UpdateCollabaratorsResponse,
} from "~/.server/services/Codepush/types";

export type UpdateCollabaratorArgs = Omit<UpdateCollabaratorsRequest, "userId">;

export const updateAppCollabarator = async ({
  email,
  tenant,
  appId,
  role,
}: UpdateCollabaratorArgs) => {
  const { data } = await axios.patch<
    null,
    AxiosResponse<UpdateCollabaratorsResponse>
  >(route("/api/v1/:app/collaborators", { app: appId }), {
    email,
    tenant,
    role,
  });

  return data;
};
