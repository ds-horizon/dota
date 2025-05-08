import { useQuery } from "react-query";
import {
  getReleaseDataForDeployment,
  GetReleaseDataForDeploymentArgs,
} from "../data/getReleaseDataForDeployment";

export const useGetReleaseDataForDeployment = (
  args: GetReleaseDataForDeploymentArgs
) => {
  return useQuery(
    [`${args.appId}-${args.deploymentName}-${args.label}-deployment-list`], // Use an array for the query key
    () => getReleaseDataForDeployment(args), // Call the function with the deploymentId
    {
      refetchOnWindowFocus: false,
    }
  );
};
