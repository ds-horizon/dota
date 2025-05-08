import axios, { AxiosResponse } from "axios";
import { route } from "routes-gen";
import { TenantsResponse } from "~/.server/services/Codepush/types";

type Organization = {
  id: string;
  orgName: string;
  isAdmin: boolean;
};

// const data: Organization[] = [
//   {
//     id: "1",
//     orgName: "TechCorp",
//     isAdmin: true,
//   },
//   {
//     id: "2",
//     orgName: "InnovateX",
//     isAdmin: false,
//   },
//   {
//     id: "3",
//     orgName: "CodeMaster",
//     isAdmin: true,
//   },
//   {
//     id: "4",
//     orgName: "DevSolutions",
//     isAdmin: false,
//   },
// ];

export const getOrgList = async (): Promise<Organization[]> => {
  const { data } = await axios.get<null, AxiosResponse<TenantsResponse>>(
    route("/api/v1/tenants")
  );
  return data.organisations.map((item) => {
    return {
      id: item.id,
      orgName: item.displayName,
      isAdmin: item.role === "Owner",
    };
  });
};
