import axios, { AxiosResponse } from "axios";
import { route } from "routes-gen";
import {
  AccessKeyResponse,
  CreateAccessKeyRequest,
} from "~/.server/services/Codepush/types";

export type AccessToken = {
  id: string;
  name: string;
  role: CreateAccessKeyRequest["access"];
};

// const data: AccessToken[] = [
//   {
//     id: "1a2b3c4d",
//     name: "User One",
//     role: "READ",
//   },
//   {
//     id: "2b3c4d5e",
//     name: "User Two",
//     role: "WRITE",
//   },
//   {
//     id: "3c4d5e6f",
//     name: "User Three",
//     role: "READ",
//   },
//   {
//     id: "4d5e6f7g",
//     name: "User Four",
//     role: "WRITE",
//   },
// ];

export const getAccessTokenList = async (): Promise<AccessToken[]> => {
  const { data } = await axios.get<null, AxiosResponse<AccessKeyResponse>>(
    route("/api/v1/access-keys")
  );

  return data.accessKeys.map((item) => {
    return { id: item.id, name: item.friendlyName, role: item.scope ?? "All" };
  });
};
