import { useQuery } from "react-query";
import { getOrgList } from "../data/getOrgList";

export const useGetOrgList = () => {
  return useQuery("orgs", getOrgList);
};
