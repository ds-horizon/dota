import { useQuery } from "react-query";
import { getAccessTokenList } from "../data/getAccessTokenList";

export const useGetAccessTokenList = () => {
  return useQuery(
    [`access-token-list`], // Use an array for the query key
    () => getAccessTokenList() // Call the function with the deploymentId
  );
};
