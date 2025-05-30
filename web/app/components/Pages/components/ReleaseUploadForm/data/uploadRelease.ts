import axios from "axios";
import { route } from "routes-gen";

type UploadReleaseArgs = {
  appId: string;
  deploymentName: string;
  formData: FormData;
};

export const uploadRelease = async (args: UploadReleaseArgs) => {
  const { data } = await axios.post(
    `/api/v1/${encodeURIComponent(args.appId)}/deployments/${encodeURIComponent(args.deploymentName)}/releases`,
    args.formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return data;
}; 