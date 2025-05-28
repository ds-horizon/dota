import { useMutation } from "react-query";
import { uploadRelease } from "../data/uploadRelease";
import { notifications } from "@mantine/notifications";
import { handleApiError } from "~/utils/handleApiError";

type UploadReleaseArgs = {
  appId: string;
  deploymentName: string;
  formData: FormData;
};

export const useUploadRelease = () => {
  return useMutation(uploadRelease, {
    onError: (e) => {
      notifications.show({
        color: "red",
        title: "Release Upload",
        message: handleApiError(e, "Error while uploading release"),
      });
    },
  });
}; 