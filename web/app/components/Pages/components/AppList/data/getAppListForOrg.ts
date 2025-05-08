import axios, { AxiosResponse } from "axios";
import { route } from "routes-gen";
import { AppsResponse } from "~/.server/services/Codepush/types";
import { Collaborator } from "../../CollaboratorList/data/getAppCollaborator";

export type AppCardResponse = {
  id: string;
  name: string;
  description: string;
  isAdmin: boolean;
  role: Collaborator["permission"];
};

// const data: AppCardResponse[] = [
//   {
//     id: "app 001",
//     name: "CodePush Dashboard",
//     description: "A dashboard to manage CodePush deployments and releases.",
//     metrics: {
//       numberOfDeployments: "42",
//       numberOfReleases: "8",
//     },
//   },
//   {
//     id: "app-002",
//     name: "Deployment Tracker",
//     description: "Track and monitor your app deployments in real-time.",
//     metrics: {
//       numberOfDeployments: "15",
//       numberOfReleases: "4",
//     },
//   },
//   {
//     id: "app-003",
//     name: "Release Manager",
//     description: "Manage releases and rollout strategies efficiently.",
//     metrics: {
//       numberOfDeployments: "67",
//       numberOfReleases: "10",
//     },
//   },
//   {
//     id: "app-004",
//     name: "Metrics Hub",
//     description:
//       "Comprehensive insights into app performance and user engagement.",
//     metrics: {
//       numberOfDeployments: "23",
//       numberOfReleases: "5",
//     },
//   },
//   {
//     id: "app-005",
//     name: "App Insights",
//     description:
//       "Gain visibility into your app’s performance and user metrics.",
//     metrics: {
//       numberOfDeployments: "50",
//       numberOfReleases: "12",
//     },
//   },
//   {
//     id: "app-006",
//     name: "Version Control",
//     description: "Control app versions and manage seamless rollbacks.",
//     metrics: {
//       numberOfDeployments: "30",
//       numberOfReleases: "6",
//     },
//   },
//   {
//     id: "app-007",
//     name: "User Engagement Pro",
//     description: "Maximize user engagement with targeted updates.",
//     metrics: {
//       numberOfDeployments: "80",
//       numberOfReleases: "14",
//     },
//   },
//   {
//     id: "app-008",
//     name: "Update Monitor",
//     description: "Monitor app updates and feedback in real time.",
//     metrics: {
//       numberOfDeployments: "20",
//       numberOfReleases: "3",
//     },
//   },
//   {
//     id: "app-009",
//     name: "AppStream",
//     description: "Deliver continuous updates to ensure smooth app performance.",
//     metrics: {
//       numberOfDeployments: "90",
//       numberOfReleases: "18",
//     },
//   },
//   {
//     id: "app-010",
//     name: "DeployPro",
//     description:
//       "A one-stop solution for managing large-scale app deployments.",
//     metrics: {
//       numberOfDeployments: "35",
//       numberOfReleases: "7",
//     },
//   },
// ];

export type GetAppListForOrgArgs = {
  orgId: string;
  userEmail: string;
};

export const getAppListForOrg = async ({
  orgId,
  userEmail,
}: GetAppListForOrgArgs): Promise<AppCardResponse[]> => {
  const { data } = await axios.get<null, AxiosResponse<AppsResponse>>(
    route("/api/v1/:org/apps", {
      org: orgId,
    })
  );

  return data.apps.map((item) => {
    const role = item?.collaborators?.[userEmail]?.permission ?? "Collaborator";

    return {
      id: item.name,
      name: item.name,
      description: "",
      metrics: {
        numberOfDeployments: "NA",
        numberOfReleases: "NA",
      },
      isAdmin: role === "Owner",
      role,
    };
  });
};
