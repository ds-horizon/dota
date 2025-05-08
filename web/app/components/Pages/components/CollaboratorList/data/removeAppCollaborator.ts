import axios, { AxiosResponse } from "axios";
import { route } from "routes-gen";
import {
  RemoveCollabaratorsRequest,
  RemoveCollabaratorsResponse,
} from "~/.server/services/Codepush/types";

export type RemoveCollabaratorArgs = Omit<RemoveCollabaratorsRequest, "userId">;

export const removeAppCollabarator = async ({
  email,
  tenant,
  appId,
}: RemoveCollabaratorArgs) => {
  const { data } = await axios.delete<
    null,
    AxiosResponse<RemoveCollabaratorsResponse>
  >(route("/api/v1/:app/collaborators", { app: appId }), {
    headers: { email, tenant },
  });

  return data;
};
