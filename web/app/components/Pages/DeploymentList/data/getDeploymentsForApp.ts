import axios, { AxiosResponse } from "axios";

import { route } from "routes-gen";
import { DeploymentsResponse } from "~/.server/services/Codepush/types";

export type DeploymentData = {
  id: string;
  name: string;
  createdBy: string;
  deploymentKey: string;
};

// const data: DeploymentData[] = [
//   {
//     id: "deploy-001",
//     name: "Initial Release",
//     createdBy: "JohnDoe",
//     deploymentKey: "abc123def456",
//   },
//   {
//     id: "deploy-002",
//     name: "Bug Fix v1.1",
//     createdBy: "JaneSmith",
//     deploymentKey: "xyz789ghi101",
//   },
//   {
//     id: "deploy-003",
//     name: "Feature Update v1.2",
//     createdBy: "MikeTaylor",
//     deploymentKey: "lmn456opq789",
//   },
//   {
//     id: "deploy-004",
//     name: "Hotfix v1.2.1",
//     createdBy: "EmilyClark",
//     deploymentKey: "rst123uvw456",
//   },
//   {
//     id: "deploy-005",
//     name: "Performance Improvements",
//     createdBy: "ChrisLee",
//     deploymentKey: "ghi567jkl890",
//   },
//   {
//     id: "deploy-006",
//     name: "UI Overhaul v2.0",
//     createdBy: "JohnDoe",
//     deploymentKey: "mno321pqr654",
//   },
//   {
//     id: "deploy-007",
//     name: "Security Patch v2.1",
//     createdBy: "JaneSmith",
//     deploymentKey: "opq987stu321",
//   },
//   {
//     id: "deploy-008",
//     name: "New Features v2.2",
//     createdBy: "MikeTaylor",
//     deploymentKey: "stu654vwx432",
//   },
//   {
//     id: "deploy-009",
//     name: "Stability Improvements",
//     createdBy: "EmilyClark",
//     deploymentKey: "vwx876yzb234",
//   },
//   {
//     id: "deploy-010",
//     name: "Minor Bug Fixes v2.3",
//     createdBy: "ChrisLee",
//     deploymentKey: "yzb321abc456",
//   },
//   {
//     id: "deploy-011",
//     name: "Refactoring v2.4",
//     createdBy: "JohnDoe",
//     deploymentKey: "def654ghi123",
//   },
//   {
//     id: "deploy-012",
//     name: "Production",
//     createdBy: "JaneSmith",
//     deploymentKey: "ghi432jkl765",
//   },
//   {
//     id: "deploy-013",
//     name: "Optimization Patch",
//     createdBy: "MikeTaylor",
//     deploymentKey: "jkl987mno321",
//   },
//   {
//     id: "deploy-014",
//     name: "UX Enhancements v3.1",
//     createdBy: "EmilyClark",
//     deploymentKey: "mno543pqr876",
//   },
//   {
//     id: "deploy-015",
//     name: "Accessibility Update",
//     createdBy: "ChrisLee",
//     deploymentKey: "pqr432stu987",
//   },
//   {
//     id: "deploy-016",
//     name: "Security Fixes v3.2",
//     createdBy: "JohnDoe",
//     deploymentKey: "stu123vwx987",
//   },
//   {
//     id: "deploy-017",
//     name: "Major Release v4.0",
//     createdBy: "JaneSmith",
//     deploymentKey: "vwx321yzb654",
//   },
//   {
//     id: "deploy-018",
//     name: "Patch v4.0.1",
//     createdBy: "MikeTaylor",
//     deploymentKey: "yzb432abc765",
//   },
//   {
//     id: "deploy-019",
//     name: "Hotfix v4.0.2",
//     createdBy: "EmilyClark",
//     deploymentKey: "abc765def543",
//   },
//   {
//     id: "deploy-020",
//     name: "UI/UX Refresh v4.1",
//     createdBy: "ChrisLee",
//     deploymentKey: "def987ghi876",
//   },
// ];

export const getDeploymentsForApp = async (
  id: string
): Promise<DeploymentData[]> => {
  const { data } = await axios.get<null, AxiosResponse<DeploymentsResponse>>(
    route("/api/v1/:app/deployments", {
      app: id,
    })
  );

  return data.deployments.map((item) => {
    return {
      id: item.id,
      name: item.name,
      createdBy: "Dummy User",
      deploymentKey: item.key,
    };
  });
};
