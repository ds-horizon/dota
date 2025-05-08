import axios, { AxiosResponse } from "axios";
import { route } from "routes-gen";
import {
  DeleteAccessKeyRequest,
  DeleteAccessKeyResponse,
} from "~/.server/services/Codepush/types";

export type DeleteAccessKeyArgs = Omit<DeleteAccessKeyRequest, "userId">;

export const deleteAccessToken = async ({ name }: DeleteAccessKeyArgs) => {
  const { data } = await axios.delete<
    null,
    AxiosResponse<DeleteAccessKeyResponse>
  >(route("/api/v1/access-keys"), {
    headers: { name },
  });

  return data;
};
