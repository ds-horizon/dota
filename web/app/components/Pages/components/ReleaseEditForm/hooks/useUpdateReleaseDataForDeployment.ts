import { useMutation } from "react-query";
import { updateReleaseDataForDeployment } from "../data/updateReleaseDataForDeployment";
import { notifications } from "@mantine/notifications";
import { handleApiError } from "~/utils/handleApiError";

export const useUpdateReleaseDataForDeployment = () => {
  return useMutation(updateReleaseDataForDeployment, {
    onError: (e) => {
      notifications.show({
        color: "red",
        title: "Deployment Release Updation",
        message: handleApiError(e, "Error While Updating Release"),
      });
    },
  });
};
