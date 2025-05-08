import axios, { AxiosResponse } from "axios";
import { route } from "routes-gen";
import {
  CollabaratorsRequest,
  CollabaratorsResponse,
  Organization,
} from "~/.server/services/Codepush/types";

export type Collaborator = {
  name: string;
  permission: Organization["role"];
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

export type CollaboratorRequest = Omit<CollabaratorsRequest, "userId">;

export const getAppCollaboratorList = async ({
  appId,
  tenant,
}: CollaboratorRequest): Promise<Collaborator[]> => {
  const { data } = await axios.get<null, AxiosResponse<CollabaratorsResponse>>(
    route("/api/v1/:app/collaborators", { app: appId }),
    {
      headers: {
        tenant,
      },
    }
  );

  return Object.entries(data.collaborators).map(([name, value]) => {
    return {
      name,
      permission: value.permission,
    };
  });
};
