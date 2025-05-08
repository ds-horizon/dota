import { useQuery } from "react-query";
import {
  getReleaseListForDeployment,
  GetReleaseParamArgs,
} from "../data/getReleaseListForDeployment";

export const useGetReleaseListForDeployment = (data: GetReleaseParamArgs) => {
  return useQuery(
    [`${data.appId}-${data.deploymentName}-deployment-list`], // Use an array for the query key
    () => getReleaseListForDeployment(data), // Call the function with the deploymentId
    {
      refetchOnWindowFocus: false,
    }
  );
};
