import {
  getReleaseListForDeployment,
  GetReleaseParamArgs,
  ReleaseListResponse,
} from "../../ReleaseListForDeploymentTable/data/getReleaseListForDeployment";

export type GetReleaseDataForDeploymentArgs = {
  label: string;
} & GetReleaseParamArgs;

export const getReleaseDataForDeployment = async (
  request: GetReleaseDataForDeploymentArgs
): Promise<ReleaseListResponse | undefined> => {
  const data = await getReleaseListForDeployment(request);
  return data.filter((item) => item.id === request.label)[0];
};
