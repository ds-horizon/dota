import axios, { AxiosResponse } from "axios";
import { route } from "routes-gen";
import {
  AddCollabaratorsRequest,
  AddCollabaratorsResponse,
} from "~/.server/services/Codepush/types";

export type AddCollabaratorsArgs = Omit<AddCollabaratorsRequest, "userId">;

export const addCollabarator = async ({
  email,
  tenant,
  appId,
}: AddCollabaratorsArgs) => {
  const { data } = await axios.post<
    null,
    AxiosResponse<AddCollabaratorsResponse>
  >(route("/api/v1/:app/collaborators", { app: appId }), {
    email,
    tenant,
  });

  return data;
};
