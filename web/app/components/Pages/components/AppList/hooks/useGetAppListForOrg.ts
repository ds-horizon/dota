import { useQuery } from "react-query";
import {
  getAppListForOrg,
  GetAppListForOrgArgs,
} from "../data/getAppListForOrg";

export const useGetAppListForOrg = (data: GetAppListForOrgArgs) => {
  return useQuery(`appList-for-${data.orgId}`, () => getAppListForOrg(data));
};
