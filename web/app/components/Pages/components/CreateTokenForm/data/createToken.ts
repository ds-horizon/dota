import axios, { AxiosResponse } from "axios";
import { route } from "routes-gen";
import {
  CreateAccessKeyRequest,
  CreateAccessKeyResponse,
} from "~/.server/services/Codepush/types";

export type CreateTokenArgs = Omit<CreateAccessKeyRequest, "userId">;

export const createToken = async ({ name, access }: CreateTokenArgs) => {
  const { data } = await axios.post<
    null,
    AxiosResponse<CreateAccessKeyResponse>
  >(route("/api/v1/access-keys"), {
    name,
    access,
  });

  return data.accessKey;
};
